import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, Pencil } from "lucide-react";

const upcomingTests = [
  {
    subject: 'Mathematics',
    topic: 'Algebra II - Final',
    date: '2024-08-15',
    time: '10:00 AM',
    duration: '90 mins',
  },
  {
    subject: 'Physics',
    topic: 'Mechanics',
    date: '2024-08-20',
    time: '02:00 PM',
    duration: '60 mins',
  },
];

export default function TestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Online Tests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tests</CardTitle>
          <CardDescription>Here are your scheduled online tests. Make sure you're prepared!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {upcomingTests.map((test, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary" /> {test.subject}
                </CardTitle>
                <CardDescription>{test.topic}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{test.date} at {test.time}</span>
                </div>
                 <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Duration: {test.duration}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Past Tests</CardTitle>
           <CardDescription>Review your performance on previous tests.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your past test results will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
