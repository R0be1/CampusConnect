
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileUp, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];
const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  grade: z.string().min(1, "Please select a grade."),
  subject: z.string().min(1, "Please select a subject."),
  type: z.enum(["Video", "Document"], { required_error: "Please select a material type." }),
  file: z.any()
    .refine((files) => files?.length == 1, "File is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function UploadMaterialForm() {
    const { toast } = useToast();
    const form = useForm<UploadFormValues>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            title: "",
            description: "",
            file: undefined,
        },
    });

    const fileRef = form.register("file");
    const materialType = form.watch("type");

    function onSubmit(data: UploadFormValues) {
        console.log(data);
        toast({
            title: "Upload Successful",
            description: `Material "${data.title}" has been published.`,
        });
        form.reset();
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle>Upload New Material</CardTitle>
                <CardDescription>Fill in the form below to add a new resource.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Introduction to Calculus" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief summary of the material." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="grid md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="grade" render={({ field }) => (
                                <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Material Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Video">Video</SelectItem><SelectItem value="Document">Document</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>

                        {materialType && (
                            <FormField control={form.control} name="file" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload {materialType}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Button size="icon" variant="outline" className="absolute left-0 top-0 rounded-r-none" asChild>
                                                <Label htmlFor="file-upload" className="cursor-pointer">
                                                    <FileUp className="h-4 w-4" />
                                                </Label>
                                            </Button>
                                            <Input 
                                                id="file-upload"
                                                type="file" 
                                                accept={materialType === 'Video' ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx"}
                                                className="pl-12"
                                                {...fileRef}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        {materialType === 'Video' ? 'Supported formats: MP4, WEBM, OGG. Max 5MB.' : 'Supported formats: PDF, DOCX, PPTX. Max 5MB.'}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                             )} />
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />} 
                                {form.formState.isSubmitting ? "Uploading..." : "Upload and Publish"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
