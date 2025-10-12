import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
  Monitor,
  Smartphone,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  useStorageAnalytics,
  useVisitorAnalytics,
} from "@/hooks/api/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AnalyticsPage() {
  const { data: storageData, isLoading, error } = useStorageAnalytics();
  const {
    data: visitorData,
    isLoading: visitorLoading,
    error: visitorError,
  } = useVisitorAnalytics(30);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStorageStatus = (usagePercent: number, canUpload: boolean) => {
    if (usagePercent >= 90)
      return { color: "text-red-600", icon: AlertTriangle, status: "Critical" };
    if (usagePercent >= 75)
      return {
        color: "text-yellow-600",
        icon: AlertTriangle,
        status: "Warning",
      };
    if (canUpload)
      return { color: "text-green-600", icon: CheckCircle, status: "Healthy" };
    return { color: "text-gray-600", icon: HardDrive, status: "Unknown" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          View website statistics and insights
        </p>
      </div>

      {/* Storage Analytics Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardDrive className="h-6 w-6" />
            <CardTitle>Storage Analytics</CardTitle>
          </div>
          <CardDescription>Current storage usage and capacity</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load storage analytics</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please try refreshing the page or contact support if the issue
                persists.
              </p>
            </div>
          ) : storageData?.data ? (
            <div className="space-y-6">
              {/* Storage Usage Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {storageData.data.usage_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      storageData.data.usage_percent >= 90
                        ? "bg-red-500"
                        : storageData.data.usage_percent >= 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        storageData.data.usage_percent,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {formatBytes(storageData.data.total_size_bytes)} used
                  </span>
                  <span>
                    {formatBytes(storageData.data.storage_limit_bytes)} total
                  </span>
                </div>
              </div>

              {/* Storage Status */}
              {(() => {
                const status = getStorageStatus(
                  storageData.data.usage_percent,
                  storageData.data.can_upload
                );
                const StatusIcon = status.icon;
                return (
                  <div className={`flex items-center gap-2 ${status.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{status.status}</span>
                  </div>
                );
              })()}

              {/* Storage Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {storageData.data.object_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Files
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {storageData.data.total_size_gb.toFixed(2)} GB
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Used Storage
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {storageData.data.storage_limit_gb.toFixed(2)} GB
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Storage Limit
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {storageData.data.remaining_mb.toFixed(0)} MB
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>

              {/* Upload Status */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {storageData.data.can_upload ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {storageData.data.can_upload
                      ? "Uploads Allowed"
                      : "Uploads Disabled"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {storageData.data.can_upload
                    ? "You can continue uploading files"
                    : "Storage limit reached - uploads disabled"}
                </span>
              </div>

              {/* Higher Tier Benefits */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Higher Tier Benefits
                  </span>
                </div>
                <div className="text-sm text-blue-600">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-3 w-3" />
                    <span>Expanded storage capacity</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No storage data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visitor Analytics Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <CardTitle>Visitor Analytics</CardTitle>
          </div>
          <CardDescription>
            Website visitor statistics and insights for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visitorLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          ) : visitorError ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load visitor analytics</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please try refreshing the page or contact support if the issue
                persists.
              </p>
            </div>
          ) : visitorData?.data ? (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Visitors</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {visitorData.data.total_visitors.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Unique Visitors</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {visitorData.data.unique_visitors.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Today</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {visitorData.data.today_visitors.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">This Week</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {visitorData.data.this_week_visitors.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Analytics Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visitorData.data.top_pages
                          ?.slice(0, 5)
                          .map((page, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {page.page === "/" ? "Home" : page.page}
                              </TableCell>
                              <TableCell className="text-right">
                                {page.count.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          )) || (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center text-muted-foreground"
                            >
                              No page data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Top Countries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Countries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Country</TableHead>
                          <TableHead className="text-right">Visitors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visitorData.data.top_countries
                          ?.slice(0, 5)
                          .map((country, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {country.country}
                              </TableCell>
                              <TableCell className="text-right">
                                {country.count.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          )) || (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center text-muted-foreground"
                            >
                              No country data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Top Devices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Devices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {visitorData.data.top_devices?.map((device, index) => {
                        const Icon =
                          device.device === "mobile"
                            ? Smartphone
                            : device.device === "desktop"
                            ? Monitor
                            : Monitor;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="capitalize">
                                {device.device}
                              </span>
                            </div>
                            <span className="font-medium">
                              {device.count.toLocaleString()}
                            </span>
                          </div>
                        );
                      }) || (
                        <div className="text-center text-muted-foreground py-4">
                          No device data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Browsers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Browsers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {visitorData.data.top_browsers?.map((browser, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="capitalize">
                              {browser.browser}
                            </span>
                          </div>
                          <span className="font-medium">
                            {browser.count.toLocaleString()}
                          </span>
                        </div>
                      )) || (
                        <div className="text-center text-muted-foreground py-4">
                          No browser data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No visitor data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Analytics Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <CardTitle>Advanced Analytics</CardTitle>
          </div>
          <CardDescription>Features in higher tier plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-4">
                <TrendingUp className="h-4 w-4" />
                Higher Tier Features
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Transform Your Tourism Business
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Take your destination management to the next level with advanced
                analytics, multi-user collaboration, and comprehensive booking
                management tools designed specifically for tourism
                professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Advanced Analytics */}
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Advanced Analytics</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time visitor behavior tracking</li>
                  <li>• Conversion funnel analysis</li>
                  <li>• Revenue attribution modeling</li>
                  <li>• Custom dashboard creation</li>
                  <li>• Predictive analytics insights</li>
                </ul>
              </div>

              {/* Multi-User Management */}
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Multi-User Access</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Role-based permissions system</li>
                  <li>• Team collaboration tools</li>
                  <li>• Admin, manager, and staff roles</li>
                  <li>• Support for more concurrent users</li>
                  <li>• Activity tracking and audit logs</li>
                  <li>• Secure user authentication</li>
                </ul>
              </div>

              {/* Booking Management */}
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold">Booking Management</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Facility and destination bookings</li>
                  <li>• Automated scheduling system</li>
                  <li>• Payment processing integration</li>
                  <li>• Customer communication tools</li>
                  <li>• Revenue optimization insights</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to unlock the full potential of your tourism platform?
              </p>
              <a
                href="mailto:fauzanebd@gmail.com?subject=Higher Tier Features Inquiry&body=Hi, I'm interested in learning more about the higher tier features for the tourism platform."
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
              >
                <span>Contact: fauzanebd@gmail.com</span>
                <TrendingUp className="h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
