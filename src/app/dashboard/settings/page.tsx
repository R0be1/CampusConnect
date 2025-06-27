
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Book, GraduationCap, Calendar } from 'lucide-react';

const menuItems = [
    { title: 'Courses', description: 'Manage courses and assign them to classes.', href: '/dashboard/settings/courses', icon: Book },
    { title: 'Grades & Sections', description: 'Define the grades and sections for the school.', href: '/dashboard/settings/grades-sections', icon: GraduationCap },
    { title: 'Academic Year', description: 'Set the current academic year for the system.', href: '/dashboard/settings/academic-year', icon: Calendar },
];

export default function SettingsMenuPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">System Settings</h1>
            <p className="text-muted-foreground">Select a category to configure.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                    <Link href={item.href} key={item.href} className="block">
                        <Card className="h-full hover:bg-muted/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <item.icon className="h-6 w-6 text-primary" />
                                    <div>
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardDescription className="mt-1">{item.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
