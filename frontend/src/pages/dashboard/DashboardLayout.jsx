import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, Users, Package, Settings, Truck, MapPin, CheckCircle, FileText, Map, Brain, Shield, BarChart, Activity, Bell, Search, ChevronDown, LogOut, Plus, Menu, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

function UserAvatar({ name }) {
  const initials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "??"
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
      {initials}
    </div>
  )
}

// DashboardLayout.jsx ke andar ka function (top pe)
const getNavItems = (role) => {
  // Always return arrays, never return nested objects like before
  if (role === 'ADMIN') {
    return [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { href: '/dashboard/users', icon: Users, label: 'User Management' },
      { href: '/dashboard/shipments', icon: Package, label: 'Shipment Management' },
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];
  }
  if (role === 'DRIVER') {
    return [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { href: '/dashboard/tasks', icon: Truck, label: 'My Tasks' },
      { href: '/dashboard/location', icon: MapPin, label: 'Update Location' },
      { href: '/dashboard/driver-shipments', icon: CheckCircle, label: 'Delivered Shipments' },
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];
  }
  if (role === 'COMPANY_OFFICER' || role === 'PORT_MANAGER') {
    return [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { href: '/dashboard/audit', icon: FileText, label: 'Audit Logs' },
      { href: '/dashboard/live-map', icon: Map, label: 'Live Map' },
      { href: '/dashboard/decision', icon: Brain, label: 'Decision Intelligence' },
      { href: '/dashboard/compliance', icon: Shield, label: 'Compliance' },
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];
  }
  if (role === 'CUSTOMER') {
    return [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { href: '/dashboard/track', icon: MapPin, label: 'Track Shipment' },
      { href: '/dashboard/reports', icon: BarChart, label: 'Reports' },
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];
  }
  
  return []; // Fallback for guest or unknown role
};

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const roleNavItems = getNavItems(user?.role || 'GUEST')

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-4 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground">Track<span className="text-primary font-extrabold">2</span>Act</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {roleNavItems.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-4 border-t border-border/50">
              <UserAvatar name={user?.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                <Badge variant="secondary" className="mt-0.5 text-xs capitalize">
                  {user?.role || 'Guest'}
                </Badge>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          {/* Fixed Navbar z-50 */}
          <header className="sticky top-0 z-[50] flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 px-4 backdrop-blur-md lg:px-6">
            <div className="flex items-center gap-2 lg:gap-4">
              <SidebarTrigger className="lg:hidden" />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => { /* Global refresh impl later */ }}
                disabled={refreshing}
                title="Refresh Data"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Separator orientation="vertical" className="mr-2 hidden lg:block h-4" />
            </div>
            <div className="flex-1">
              <div className="relative max-w-sm hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input placeholder="Search shipments, drivers, routes..." className="w-full pl-10 bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-ring/20 h-9" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-emerald-50 hidden md:flex">
                <span className="relative">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              </div>
              <ThemeSwitcher />
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-0 hover:bg-accent hover:text-accent-foreground">
                    <UserAvatar name={user?.name} />
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={10} align="end" className="w-56">
                  <DropdownMenuItem className="flex-col items-start">
                    <div className="text-xs font-medium">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          {/* Main Content */}
          <main className="flex flex-1 overflow-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

