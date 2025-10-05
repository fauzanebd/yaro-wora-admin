import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage admin users and permissions</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <CardTitle>Under Construction</CardTitle>
          </div>
          <CardDescription>User management is coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will allow you to manage admin users, set roles and permissions, and control access to different parts of the dashboard.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Planned Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Create and manage admin users</li>
              <li>Role-based access control</li>
              <li>Permission management</li>
              <li>User activity logs</li>
              <li>Password reset functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

