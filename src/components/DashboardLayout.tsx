import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Image,
  MapPin,
  FileText,
  Building2,
  Newspaper,
  MessageSquare,
  BarChart3,
  ChevronDown,
  LogOut,
  Landmark,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

interface MenuItem {
  title: string;
  icon: any;
  url?: string;
  items?: { title: string; url: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Main Page",
    icon: Home,
    items: [
      { title: "Carousel", url: "/main/carousel" },
      { title: "Selling Points", url: "/main/selling-points" },
      { title: "Why Visit", url: "/main/why-visit" },
      { title: "Attractions", url: "/main/attractions" },
      { title: "Pricing", url: "/main/pricing" },
    ],
  },
  {
    title: "Profile",
    icon: FileText,
    url: "/profile",
  },
  {
    title: "Destinations",
    icon: MapPin,
    url: "/destinations",
  },

  {
    title: "Gallery",
    icon: Image,
    url: "/gallery",
  },
  {
    title: "Regulations",
    icon: FileText,
    url: "/regulations",
  },
  {
    title: "Facilities",
    icon: Building2,
    url: "/facilities",
  },
  {
    title: "News",
    icon: Newspaper,
    url: "/news",
  },
  {
    title: "Heritage",
    icon: Landmark,
    url: "/heritage",
  },
  {
    title: "Contact",
    icon: MessageSquare,
    url: "/contact",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/analytics",
  },
  // {
  //   title: "Users",
  //   icon: Users,
  //   url: "/users",
  // },
];

function AppSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 p-4">
          <img
            src="/LogoYaroWora_PrimaryLogo_Horizontal@3x.png"
            alt="Yaro Wora"
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <Collapsible key={item.title} defaultOpen={false}>
                  <SidebarMenuItem>
                    {item.items ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.url}>
                                <SidebarMenuSubButton
                                  onClick={() => navigate(subItem.url)}
                                >
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        onClick={() => item.url && navigate(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// Utility function to generate breadcrumbs based on current route
function generateBreadcrumbs(
  pathname: string
): Array<{ label: string; href?: string }> {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; href?: string }> = [
    { label: "Dashboard", href: "/" },
  ];

  if (pathSegments.length === 0) {
    return breadcrumbs;
  }

  // Map route segments to readable labels
  const routeLabels: Record<string, string> = {
    main: "Main Page",
    carousel: "Carousel",
    "selling-points": "Selling Points",
    "why-visit": "Why Visit",
    attractions: "Attractions",
    pricing: "Pricing",
    profile: "Profile",
    destinations: "Destinations",
    gallery: "Gallery",
    regulations: "Regulations",
    facilities: "Facilities",
    news: "News",
    heritage: "Heritage",
    contact: "Contact",
    analytics: "Analytics",
    users: "Users",
  };

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label =
      routeLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    // Don't add href for the last segment (current page)
    const href = index === pathSegments.length - 1 ? undefined : currentPath;

    breadcrumbs.push({ label, href });
  });

  return breadcrumbs;
}

export default function DashboardLayout() {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header breadcrumbs={breadcrumbs} />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

interface HeaderProps {
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-4 px-4 w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>

        <div className="flex-1 min-w-0 hidden lg:block">
          <BreadcrumbSection breadcrumbs={breadcrumbs} />
        </div>

        <div className="flex-1 min-w-0 block lg:hidden"></div>
      </div>
    </header>
  );
}

function BreadcrumbSection({
  breadcrumbs,
}: {
  breadcrumbs?: Array<{ label: string; href?: string }>;
}) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {breadcrumb.href && index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.href} className="cursor-pointer">
                    {breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
