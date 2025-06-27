
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileUp } from "lucide-react";

const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];
const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

export function UploadMaterialForm() {
    const [materialType, setMaterialType] = useState("");
    return (
         <Card>
            <CardHeader>
                <CardTitle>Upload New Material</CardTitle>
                <CardDescription>Fill in the form below to add a new resource.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g., Introduction to Calculus" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="A brief summary of the material." />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Select>
                            <SelectTrigger id="grade"><SelectValue placeholder="Select a grade" /></SelectTrigger>
                            <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                            <SelectTrigger id="subject"><SelectValue placeholder="Select a subject" /></SelectTrigger>
                            <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Material Type</Label>
                        <Select onValueChange={setMaterialType}>
                            <SelectTrigger id="type"><SelectValue placeholder="Select a type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="Document">Document</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {materialType === "Video" && (
                     <div className="space-y-2">
                        <Label htmlFor="videoFile">Upload Video</Label>
                        <div className="relative">
                            <Button size="icon" variant="outline" className="absolute left-0 top-0 rounded-r-none" asChild>
                                <Label htmlFor="videoFile" className="cursor-pointer">
                                    <FileUp className="h-4 w-4" />
                                </Label>
                            </Button>
                            <Input id="videoFile" type="file" accept="video/*" className="pl-12" />
                        </div>
                        <p className="text-sm text-muted-foreground">Supported formats: MP4, WEBM, OGG.</p>
                    </div>
                )}
                 {materialType === "Document" && (
                    <div className="space-y-2">
                        <Label htmlFor="documentFile">Upload Document</Label>
                        <div className="relative">
                             <Button size="icon" variant="outline" className="absolute left-0 top-0 rounded-r-none" asChild>
                                <Label htmlFor="documentFile" className="cursor-pointer">
                                    <FileUp className="h-4 w-4" />
                                </Label>
                            </Button>
                             <Input id="documentFile" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="pl-12" />
                        </div>
                         <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX, PPTX.</p>
                    </div>
                )}

                 <div className="flex justify-end">
                    <Button>
                        <Upload className="mr-2 h-4 w-4" /> Upload and Publish
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
