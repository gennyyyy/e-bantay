import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  ShieldAlert,
  LayoutDashboard,
  Map as MapIcon,
  FileText,
  Bell,
  User,
  Menu,
  Settings,
  HelpCircle,
  Megaphone,
  Search,
  LogOut,
  ClipboardList,
  Sun,
  Moon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"

const sidebarItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Incident Map', href: '/map', icon: MapIcon },
  { name: 'File Report', href: '/', icon: FileText },
  { name: 'My Reports', href: '/my-reports', icon: ClipboardList },
  { name: 'Community Alerts', href: '/alerts', icon: Megaphone },
]

const bottomItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help Center', href: '/help', icon: HelpCircle },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  // Filter sidebar items based on verification status
  const filteredSidebarItems = sidebarItems.filter(item => {
    if (!user) return true; // Or handle guest? Assuming Layout is protected or guest has some access. 
    // Actually, if !user, we might want to show nothing or just public pages.
    // But for this task: Verified vs Unverified.

    if (user.isVerified) return true; // Verified users see everything

    // Unverified users cannot see 'File Report' and 'My Reports'
    // 'File Report' href is '/'
    // 'My Reports' href is '/my-reports'
    return item.href !== '/' && item.href !== '/my-reports';
  });

  const NavItem = ({ item, isMobile = false }: { item: typeof sidebarItems[0], isMobile?: boolean }) => {
    const isActive = location.pathname === item.href
    return (
      <Link
        to={item.href}
        onClick={() => isMobile && setIsMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
        )}
      >
        <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
        <span>{item.name}</span>
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
        )}
      </Link>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">E-Bantay</span>
        </div>

        <div className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
            {filteredSidebarItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          <div className="mt-auto space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Support</p>
            {bottomItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <div
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/settings')}
            >
              <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.isVerified ? 'Verified' : (user ? 'Pending' : 'Guest')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 z-[500] dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex h-16 items-center gap-2 px-6 border-b dark:border-slate-800">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                      <ShieldAlert className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">E-Bantay</span>
                  </div>
                  <div className="p-4 space-y-6">
                    <div className="space-y-1">
                      {filteredSidebarItems.map((item) => (
                        <NavItem key={item.name} item={item} isMobile />
                      ))}
                    </div>
                    <div className="space-y-1">
                      <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Support</p>
                      {bottomItems.map((item) => (
                        <NavItem key={item.name} item={item} isMobile />
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Search Bar */}
              <div className="hidden md:flex relative max-w-md w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search incidents, locations..."
                  className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 transition-transform duration-300" />
                ) : (
                  <Moon className="h-5 w-5 transition-transform duration-300" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
              </Button>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Brgy. Pulong Buhangin</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Santa Maria, Bulacan</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
