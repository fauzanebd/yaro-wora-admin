import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function FacilitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facilities</h1>
          <p className="text-muted-foreground">Manage bookable facilities</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Facilities management is currently being implemented</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will allow you to manage facilities that visitors can book, including lodging, meeting rooms, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

