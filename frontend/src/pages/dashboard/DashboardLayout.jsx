import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, LayoutDashboard, Map, Brain, Shield, FileText, Settings, Bell, Search, Menu, X, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/map", icon: Map, label: "Live Map" },
  { href: "/dashboard/decisions", icon: Brain, label: "Decision Intelligence" },
  { href: "/dashboard/compliance", icon: Shield, label: "Compliance" },
  { href: "/dashboard/audit", icon: FileText, label: "Audit Log" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

function UserAvatar({ name }) {
  const initials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "??"
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
      {initials}
    </div>
  )
}

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const SidebarNav = ({ onClose }) => (
    <nav className="flex-1 space-y-2 p-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link key={item.href} to={item.href} onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-2 border-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"}`}>
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {isActive && <motion.div layoutId="sidebar-indicator" className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border/50 bg-background lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6 bg-gradient-to-r from-primary/5 to-primary/0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80"><Activity className="h-4 w-4 text-primary-foreground" /></div>
          <span className="text-base font-bold text-foreground">Track<span className="text-primary font-extrabold">2</span>Act</span>
        </div>
        <SidebarNav />
        <div className="border-t border-border/50 p-4 mt-auto">
          <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/0 border border-border/50 p-3 hover:border-border transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold flex-shrink-0">
              {user?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "??"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-background border-r border-border/50 lg:hidden"
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <div className="flex h-16 items-center justify-between border-b border-border/50 px-6 bg-gradient-to-r from-primary/5 to-primary/0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80"><Activity className="h-4 w-4 text-primary-foreground" /></div>
                  <span className="text-base font-bold text-foreground">Track<span className="text-primary font-extrabold">2</span>Act</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <SidebarNav onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 lg:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden sm:block flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search shipments, routes..." className="w-full pl-9 h-9 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-success/10 border border-success/20 px-3 py-1.5 text-xs font-medium text-success sm:flex">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-success" /></span>System Live
            </div>
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground border border-background">3</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-secondary/50 transition-colors">
                  <UserAvatar name={user?.name} />
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 border-b border-border/50">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto"><Outlet /></main>
      </div>
    </div>
  )
}
