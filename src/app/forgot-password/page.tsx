
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, MessageSquareQuote, KeyRound, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Step = "enter-phone" | "verify-otp" | "success";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("enter-phone");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    console.log(`Sending OTP to ${phone}`);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify-otp");
      toast({ title: "OTP Sent", description: "A 6-digit OTP has been sent to your phone." });
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      toast({ title: "Invalid OTP", description: "The OTP you entered is incorrect.", variant: "destructive" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Invalid Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords Do Not Match", description: "Please ensure both passwords are the same.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    console.log("Resetting password...");
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case "enter-phone":
        return (
          <form onSubmit={handleSendOtp}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary p-3">
                <KeyRound className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="font-headline text-3xl">Reset Password</CardTitle>
              <CardDescription>Enter your phone number to receive a verification code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Your registered phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                Send OTP
              </Button>
            </CardContent>
          </form>
        );
      case "verify-otp":
        return (
           <form onSubmit={handleResetPassword}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary p-3">
                <ShieldCheck className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="font-headline text-3xl">Verify Code</CardTitle>
              <CardDescription>Enter the 6-digit code sent to {phone}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input id="otp" type="text" placeholder="e.g., 123456" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                Reset Password & Login
              </Button>
            </CardContent>
          </form>
        );
       case "success":
        return (
            <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-green-500 p-3">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="font-headline text-3xl">Password Reset!</CardTitle>
              <CardDescription>Your password has been updated successfully.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/">Back to Login</Link>
                </Button>
            </CardContent>
            </>
        )
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        {renderStep()}
        {step !== "success" && (
             <div className="p-6 pt-0 text-center">
                <Button variant="link" asChild className="text-muted-foreground">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back to Login
                    </Link>
                </Button>
            </div>
        )}
      </Card>
    </div>
  );
}
