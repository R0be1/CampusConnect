
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookCopy, Video, FileText, Download, PlayCircle, Search, Info, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFirstSchool, getFirstStudent } from "@/lib/data";
import { getELearningMaterialsAction, StudentPortalELearningData } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const subjects = ['All Subjects', 'Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

function ELearningLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <BookCopy className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                <CardContent><Skeleton className="h-12 w-full" /></CardContent>
                                <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ELearningStudentPage() {
    const [studentId, setStudentId] = useState<string | null>(null);
    const [materials, setMaterials] = useState<StudentPortalELearningData>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("All Subjects");

    useEffect(() => {
        const fetchStudent = async () => {
            const school = await getFirstSchool();
            if (!school) {
                setError("School configuration not found.");
                setIsLoading(false);
                return;
            }
            const student = await getFirstStudent(school.id);
            if (student) {
                setStudentId(student.id);
            } else {
                setError("Could not identify the current student.");
                setIsLoading(false);
            }
        };
        fetchStudent();
    }, [])

    useEffect(() => {
        if (studentId) {
            setIsLoading(true);
            setError(null);
            getELearningMaterialsAction(studentId)
                .then(result => {
                    if (result.success && result.data) {
                        setMaterials(result.data);
                    } else {
                        setError(result.error || "Failed to load materials.");
                        setMaterials([]);
                    }
                })
                .catch(() => setError("An unexpected error occurred."))
                .finally(() => setIsLoading(false));
        }
    }, [studentId]);

    const filteredMaterials = materials.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        const subjectMatch = subjectFilter === "All Subjects" || m.subject === subjectFilter;
        return titleMatch && subjectMatch;
    });
    
    if (isLoading) {
        return <ELearningLoadingSkeleton />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <BookCopy className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">E-Learning Library</h1>
            </div>
            <p className="text-muted-foreground">Browse and access learning materials uploaded by your teachers.</p>
            
            {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

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
                    {filteredMaterials.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredMaterials.map(mat => (
                                <Card key={mat.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="flex items-start gap-2">
                                            {mat.type === 'VIDEO' ? <Video className="h-5 w-5 mt-1 text-primary" /> : <FileText className="h-5 w-5 mt-1 text-primary" />}
                                            <span>{mat.title}</span>
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                        <Badge variant="outline" className="w-fit">{mat.grade.name}</Badge>
                                        <Badge variant="secondary" className="w-fit">{mat.subject}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-muted-foreground">{mat.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <a href={mat.url} target="_blank" rel="noopener noreferrer">
                                                {mat.type === 'VIDEO' ? <PlayCircle className="mr-2" /> : <Download className="mr-2" />}
                                                {mat.type === 'VIDEO' ? 'Watch Video' : 'Download Document'}
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="font-semibold">No materials found</p>
                            <p className="text-sm mt-1">No e-learning materials have been assigned to your grade, or none match your filters.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
