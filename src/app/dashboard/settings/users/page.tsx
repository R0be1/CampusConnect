
import { getFirstSchool, getUsersWithStaffProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { UsersRolesClient } from "./users-roles-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { getRolePermissionsAction } from "./actions";

export default async function UsersAndRolesPage() {
    const school = await getFirstSchool();
    if (!school) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No School Found</AlertTitle>
                <AlertDescription>Cannot manage users because no school exists.</AlertDescription>
            </Alert>
        );
    }

    const [users, permissions] = await Promise.all([
        getUsersWithStaffProfile(school.id),
        getRolePermissionsAction()
    ]);
    
    // Roles are now dynamically read from the permissions file.
    const staffRoles = Object.keys(permissions || {});
    const assignableRoles = ["ADMIN", "TEACHER", "ACCOUNTANT"];
    
    const formattedUsers = users
        .filter(u => u.staffProfile) // Ensure staff profile exists
        .map(u => ({
            userId: u.id,
            staffId: u.staffProfile!.id,
            name: `${u.firstName} ${u.lastName}`,
            phone: u.phone,
            role: u.staffProfile!.staffType
        }));

    return (
        <UsersRolesClient
            initialUsers={formattedUsers}
            staffRoles={staffRoles}
            assignableRoles={assignableRoles}
            initialPermissions={permissions || {}}
        />
    );
}
