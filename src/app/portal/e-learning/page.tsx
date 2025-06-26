
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookCopy, Video, FileText, Download, PlayCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock Data
const materialsData = [
    { id: 'mat001', title: 'Introduction to Algebra', description: 'A foundational video covering the basics of algebraic expressions and equations.', subject: 'Mathematics', type: 'Video', url: '#' },
    { id: 'mat002', title: 'The Fall of Rome - Reading Material', description: 'A detailed PDF document exploring the factors that led to the collapse of the Western Roman Empire.', subject: 'History', type: 'Document', url: '#' },
    { id: 'mat003', title: 'Photosynthesis Explained', description: 'This video breaks down the complex process of photosynthesis into easy-to-understand steps.', subject: 'Science', type: 'Video', url: '#' },
    { id: 'mat004', title: 'Periodic Table PDF', description: 'A high-resolution, printable PDF of the periodic table of elements.', subject: 'Science', type: 'Document', url: '#' },
    { id: 'mat005', title: 'Shakespeare\'s Sonnets', description: 'A collection of William Shakespeare\'s sonnets with analysis.', subject: 'English', type: 'Document', url: '#' },
];

const subjects = ['All Subjects', 'Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export default function ELearningPortalPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("All Subjects");

    const filteredMaterials = materialsData.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        const subjectMatch = subjectFilter === "All Subjects" || m.subject === subjectFilter;
        return titleMatch && subjectMatch;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <BookCopy className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">E-Learning Resources</h1>
            </div>
            <p className="text-muted-foreground">Browse learning materials available to your child.</p>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search materials..." 
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <div className="flex-1">
                             <Select onValueChange={setSubjectFilter} defaultValue={subjectFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredMaterials.map(mat => (
                            <Card key={mat.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-start gap-2">
                                        {mat.type === 'Video' ? <Video className="h-5 w-5 mt-1 text-primary" /> : <FileText className="h-5 w-5 mt-1 text-primary" />}
                                        <span>{mat.title}</span>
                                    </CardTitle>
                                    <Badge variant="outline" className="w-fit">{mat.subject}</Badge>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground">{mat.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <a href={mat.url} target="_blank" rel="noopener noreferrer">
                                            {mat.type === 'Video' ? <PlayCircle className="mr-2" /> : <Download className="mr-2" />}
                                            {mat.type === 'Video' ? 'Watch Video' : 'Download Document'}
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {filteredMaterials.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="font-semibold">No materials found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filter settings.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
