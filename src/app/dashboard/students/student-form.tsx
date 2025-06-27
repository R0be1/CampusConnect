
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

const studentRegistrationSchema = z.object({
  // Student info
  studentFirstName: z.string().min(1, "First name is required"),
  studentMiddleName: z.string().optional(),
  studentLastName: z.string().min(1, "Last name is required"),
  studentDob: z.date({ required_error: "Date of birth is required" }),
  studentGender: z.string().min(1, "Gender is required"),
  studentPhoto: z.any().optional(),
  grade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),

  // Parent/Guardian info
  parentFirstName: z.string().min(1, "First name is required"),
  parentMiddleName: z.string().optional(),
  parentLastName: z.string().min(1, "Last name is required"),
  parentRelation: z.string().min(1, "Relationship is required"),
  parentEmail: z.string().email("Invalid email address"),
  parentPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  parentAlternatePhone: z.string().min(10, "Must be at least 10 digits").optional().or(z.literal('')),
  parentPhoto: z.any().optional(),
  
  // Address info
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Invalid zip code"),
  schoolId: z.string().optional(),
});

export type StudentRegistrationFormValues = z.infer<typeof studentRegistrationSchema>;

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];
const relations = ['Father', 'Mother', 'Guardian'];

interface StudentFormProps {
  initialData?: Partial<StudentRegistrationFormValues>;
  onSubmit: (data: StudentRegistrationFormValues) => void;
  submitButtonText?: string;
}

export function StudentForm({ initialData, onSubmit, submitButtonText = "Register Student" }: StudentFormProps) {
  const [studentPhotoPreview, setStudentPhotoPreview] = useState<string | undefined>();
  const [parentPhotoPreview, setParentPhotoPreview] = useState<string | undefined>();
  const [isDobPickerOpen, setIsDobPickerOpen] = useState(false);
  
  const form = useForm<StudentRegistrationFormValues>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: initialData || {
      studentFirstName: "",
      studentMiddleName: "",
      studentLastName: "",
      studentPhoto: undefined,
      parentFirstName: "",
      parentMiddleName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhone: "",
      parentAlternatePhone: "",
      parentPhoto: undefined,
      addressLine1: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const handleFormSubmit = (data: StudentRegistrationFormValues) => {
      onSubmit(data);
      if (!initialData) { // only reset if it's a new registration
        form.reset();
        setStudentPhotoPreview(undefined);
        setParentPhotoPreview(undefined);
      }
  };

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Enter the details of the student.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="studentFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Michael" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="studentDob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover open={isDobPickerOpen} onOpenChange={setIsDobPickerOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                                field.onChange(date);
                                setIsDobPickerOpen(false);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentGender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center space-x-4 pt-2"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Male" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Male
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Female" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sections.map(section => <SelectItem key={section} value={section}>{section}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  control={form.control}
                  name="studentPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Photo</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border">
                                <AvatarImage src={studentPhotoPreview} data-ai-hint="person portrait" />
                                <AvatarFallback>
                                    <User className="h-10 w-10" />
                                </AvatarFallback>
                            </Avatar>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                className="max-w-xs"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        field.onChange(file);
                                        setStudentPhotoPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
              <CardDescription>Enter the details of the parent or guardian.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="parentFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Anne" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Student</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relations.map(rel => <SelectItem key={rel} value={rel}>{rel}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="parentAlternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(098) 765-4321" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="parentPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Photo (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border">
                                <AvatarImage src={parentPhotoPreview} data-ai-hint="person portrait" />
                                <AvatarFallback>
                                    <User className="h-10 w-10" />
                                </AvatarFallback>
                            </Avatar>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                className="max-w-xs"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        field.onChange(file);
                                        setParentPhotoPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Contact Address</CardTitle>
              <CardDescription>Enter the student's primary residential address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Anytown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl>
                        <Input placeholder="CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip / Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit">{submitButtonText}</Button>
          </div>
        </form>
      </Form>
  )
}
