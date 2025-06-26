"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CommunicationRecommendationsInput, CommunicationRecommendationsOutput } from "@/ai/flows/parent-teacher-communication-recommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, MessageSquare, Phone, Users, List, Lightbulb } from "lucide-react";
import { getRecommendationsAction } from "./actions";

const formSchema = z.object({
  studentPerformanceData: z.string().min(10, "Please provide more details on student performance."),
  studentBehavioralData: z.string().min(10, "Please provide more details on student behavior."),
  communicationHistory: z.string().min(10, "Please provide more details on communication history."),
});

type FormData = z.infer<typeof formSchema>;

export function CommunicationRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CommunicationRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    const result = await getRecommendationsAction(data);

    if ('error' in result) {
      setError(result.error);
    } else {
      setRecommendations(result);
    }
    setLoading(false);
  };
  
  const communicationMethodIcons: { [key: string]: React.ReactNode } = {
    'email': <MessageSquare className="h-4 w-4 mr-2" />,
    'phone call': <Phone className="h-4 w-4 mr-2" />,
    'in-person meeting': <Users className="h-4 w-4 mr-2" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-accent" />
          AI Communication Recommendations
        </CardTitle>
        <CardDescription>
          Get AI-powered recommendations for optimal parent-teacher communication strategies based on student data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="studentPerformanceData">Student Performance Data</Label>
              <Textarea
                id="studentPerformanceData"
                placeholder="e.g., Grades: Math A, Science B. Attendance: 95%..."
                {...register("studentPerformanceData")}
                className="min-h-[100px]"
              />
              {errors.studentPerformanceData && <p className="text-destructive text-sm mt-1">{errors.studentPerformanceData.message}</p>}
            </div>
            <div>
              <Label htmlFor="studentBehavioralData">Student Behavioral Data</Label>
              <Textarea
                id="studentBehavioralData"
                placeholder="e.g., Consistently participates in class. Occasionally disruptive..."
                {...register("studentBehavioralData")}
                className="min-h-[100px]"
              />
              {errors.studentBehavioralData && <p className="text-destructive text-sm mt-1">{errors.studentBehavioralData.message}</p>}
            </div>
            <div>
              <Label htmlFor="communicationHistory">Communication History</Label>
              <Textarea
                id="communicationHistory"
                placeholder="e.g., Emailed parents on 03/15 about missing homework..."
                {...register("communicationHistory")}
                className="min-h-[100px]"
              />
              {errors.communicationHistory && <p className="text-destructive text-sm mt-1">{errors.communicationHistory.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Recommendations</h3>
            {loading && (
              <div className="flex items-center justify-center p-8 h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            {recommendations && (
              <div className="space-y-6 animate-in fade-in-50">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center"><Lightbulb className="h-4 w-4 mr-2" />Communication Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{recommendations.communicationStrategy}</p>
                    <p className="text-sm text-muted-foreground mt-2">Frequency: {recommendations.communicationFrequency}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center"><List className="h-4 w-4 mr-2" />Suggested Talking Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {recommendations.talkingPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center"><MessageSquare className="h-4 w-4 mr-2" />Recommended Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {recommendations.communicationMethods.map((method, index) => (
                          <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                            {communicationMethodIcons[method.toLowerCase()] || <MessageSquare className="h-4 w-4 mr-2" />}
                            {method}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
             {!loading && !recommendations && !error && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg h-full">
                <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your recommendations will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
