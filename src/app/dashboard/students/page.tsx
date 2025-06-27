
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, UserPlus } from 'lucide-react';

const menuItems = [
    { title: 'View Roster', description: 'See a list of all enrolled students.', href: '/dashboard/students/list', icon: Users },
    { title: 'Register New', description: 'Add a new student to the school.', href: '/dashboard/students/register', icon: UserPlus },
];

export default function StudentsMenuPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Student Management</h1>
            <p className="text-muted-foreground">Select a task to continue.</p>
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
