import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DestinationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Destinations</h1>
          <p className="text-muted-foreground">Manage village destinations</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add Destination
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Destinations management is currently being implemented</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will allow you to manage tourist destinations in the village. 
            The backend API endpoints are marked as TODO and will be implemented soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

