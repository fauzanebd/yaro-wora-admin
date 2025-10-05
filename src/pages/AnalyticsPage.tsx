import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View website statistics and insights</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <CardTitle>Under Construction</CardTitle>
          </div>
          <CardDescription>Analytics dashboard is coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will show visitor statistics, popular content, booking trends, and other insights to help you understand your website's performance.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Planned Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Visitor statistics and trends</li>
              <li>Popular attractions and destinations</li>
              <li>Booking conversion rates</li>
              <li>Contact form submission analytics</li>
              <li>Geographic visitor data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

