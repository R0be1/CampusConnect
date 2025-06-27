
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare, Send, History } from 'lucide-react';

const menuItems = [
    { title: 'Compose Message', description: 'Send a new message to parents.', href: '/dashboard/communication/compose', icon: Send },
    { title: 'View History', description: 'Browse the log of sent messages.', href: '/dashboard/communication/history', icon: History },
];

export default function CommunicationMenuPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Communication</h1>
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
