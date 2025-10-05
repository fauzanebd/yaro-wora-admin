import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Image, MapPin, Building2, Newspaper, MessageSquare, BarChart3 } from 'lucide-react';

export default function DashboardHome() {
  const stats = [
    { title: 'Carousel Slides', value: '5', icon: Home, color: 'text-blue-500' },
    { title: 'Attractions', value: '12', icon: MapPin, color: 'text-green-500' },
    { title: 'Gallery Images', value: '48', icon: Image, color: 'text-purple-500' },
    { title: 'News Articles', value: '23', icon: Newspaper, color: 'text-orange-500' },
    { title: 'Facilities', value: '8', icon: Building2, color: 'text-teal-500' },
    { title: 'Contact Messages', value: '15', icon: MessageSquare, color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your Yaro Wora website today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">View and manage</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <button className="flex items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors text-left">
              <Image className="h-5 w-5" />
              <div>
                <p className="font-medium">Upload Gallery Images</p>
                <p className="text-sm text-muted-foreground">Add new photos</p>
              </div>
            </button>
            <button className="flex items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors text-left">
              <Newspaper className="h-5 w-5" />
              <div>
                <p className="font-medium">Create News Article</p>
                <p className="text-sm text-muted-foreground">Share updates</p>
              </div>
            </button>
            <button className="flex items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors text-left">
              <MessageSquare className="h-5 w-5" />
              <div>
                <p className="font-medium">Review Messages</p>
                <p className="text-sm text-muted-foreground">Check inquiries</p>
              </div>
            </button>
            <button className="flex items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors text-left">
              <BarChart3 className="h-5 w-5" />
              <div>
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-muted-foreground">Track performance</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

