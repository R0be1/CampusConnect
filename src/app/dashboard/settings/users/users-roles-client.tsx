"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, Users, CheckCircle, Shield } from "lucide-react";
import { createUserAction, updateUserRoleAction, deleteUserAction } from "./actions";

// Types
type UserData = {
    userId: string;
    staffId: string;
    name: string;
    phone: string;
    role: string;
};

type UsersRolesClientProps = {
    initialUsers: UserData[];
    staffRoles: string[];
};

const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "A valid phone number is required"),
    role: z.string().min(1, "A role must be selected"),
});

type UserFormValues = z.infer<typeof userSchema>;

// Role permissions (hardcoded as the schema is static)
const rolePermissions: Record<string, string[]> = {
    ADMIN: [
        "Full access to all modules and settings",
        "Can manage users, roles, and school settings",
        "Can approve results and manage system-wide configurations",
    ],
    TEACHER: [
        "Manage assigned courses and view student rosters",
        "Mark attendance for their classes",
        "Create and manage tests and e-learning materials",
        "Enter and submit exam results for approval",
        "Communicate with parents of their students",
    ],
    ACCOUNTANT: [
        "Manage fee structures, concessions, and penalty rules",
        "Generate and view student invoices",
        "Record and verify fee payments",
        "Access financial reports and summaries",
    ],
};

function ManageUsersTab({ initialUsers, staffRoles }: UsersRolesClientProps) {
    const { toast } = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [selectedRole, setSelectedRole] = useState("");

    const openEditDialog = (user: UserData) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setIsEditRoleOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!selectedUser || !selectedRole) return;
        setIsSubmitting(true);
        const result = await updateUserRoleAction(selectedUser.userId, selectedUser.staffId, selectedRole);
        if(result.success) {
            setUsers(prev => prev.map(u => u.userId === selectedUser.userId ? {...u, role: selectedRole} : u));
            toast({ title: "Role Updated", description: result.message });
            setIsEditRoleOpen(false);
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    const handleDeleteUser = async (userId: string) => {
        setIsSubmitting(true);
        const result = await deleteUserAction(userId);
        if(result.success) {
            setUsers(prev => prev.filter(u => u.userId !== userId));
            toast({ title: "User Deleted", description: result.message });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View, edit roles for, or delete existing staff users.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {users.map(user => (
                               <TableRow key={user.userId}>
                                   <TableCell className="font-medium">{user.name}</TableCell>
                                   <TableCell>{user.phone}</TableCell>
                                   <TableCell className="capitalize">{user.role.toLowerCase()}</TableCell>
                                   <TableCell className="text-right">
                                       <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}><Edit className="h-4 w-4" /></Button>
                                       <AlertDialog>
                                           <AlertDialogTrigger asChild>
                                               <Button variant="ghost" size="icon" disabled={isSubmitting}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                           </AlertDialogTrigger>
                                           <AlertDialogContent>
                                               <AlertDialogHeader>
                                                   <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                   <AlertDialogDescription>This will permanently delete the user {user.name} and cannot be undone.</AlertDialogDescription>
                                               </AlertDialogHeader>
                                               <AlertDialogFooter>
                                                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                   <AlertDialogAction onClick={() => handleDeleteUser(user.userId)}>Delete</AlertDialogAction>
                                               </AlertDialogFooter>
                                           </AlertDialogContent>
                                       </AlertDialog>
                                   </TableCell>
                               </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                </div>
                {users.length === 0 && <p className="text-center text-muted-foreground pt-8">No staff users found.</p>}
            </CardContent>
             <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Role for {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Select onValueChange={setSelectedRole} defaultValue={selectedRole}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {staffRoles.map(role => <SelectItem key={role} value={role} className="capitalize">{role.toLowerCase()}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateRole} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function RegisterUserTab({ staffRoles }: { staffRoles: string[] }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: { firstName: "", lastName: "", phone: "", role: "" },
    });

    const handleRegisterUser = async (data: UserFormValues) => {
        setIsSubmitting(true);
        const result = await createUserAction(data);
        if (result.success) {
            toast({ title: "User Registered", description: result.message });
            form.reset();
            // In a real app, you might re-fetch the user list or add the new user to state.
            // For now, a page reload would be the simplest way to see the new user.
            window.location.reload();
        } else {
            toast({ title: "Registration Failed", description: result.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register New User</CardTitle>
                <CardDescription>Create a new staff account. A default password will be assigned.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegisterUser)}>
                    <CardContent className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                              <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem><FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {staffRoles.map(role => <SelectItem key={role} value={role} className="capitalize">{role.toLowerCase()}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                            )} />
                         </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

function RolesAndPermissionsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Roles &amp; Permissions</CardTitle>
                <CardDescription>
                    This is a summary of permissions for each role. This is for informational purposes and cannot be changed here.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                    <Card key={role} className="bg-muted/40">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg capitalize">
                                <Shield className="h-5 w-5 text-primary" />
                                {role.toLowerCase()}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {permissions.map((perm, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-4 w-4 mt-1 flex-shrink-0 text-green-600" />
                                        <span className="text-sm text-muted-foreground">{perm}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}

export function UsersRolesClient({ initialUsers, staffRoles }: UsersRolesClientProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Users &amp; Roles</h1>
            </div>
            <Tabs defaultValue="manage" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="manage">Manage Users</TabsTrigger>
                    <TabsTrigger value="register">Register User</TabsTrigger>
                    <TabsTrigger value="permissions">Roles &amp; Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="manage" className="mt-6">
                    <ManageUsersTab initialUsers={initialUsers} staffRoles={staffRoles}/>
                </TabsContent>
                <TabsContent value="register" className="mt-6">
                    <RegisterUserTab staffRoles={staffRoles} />
                </TabsContent>
                <TabsContent value="permissions" className="mt-6">
                    <RolesAndPermissionsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
