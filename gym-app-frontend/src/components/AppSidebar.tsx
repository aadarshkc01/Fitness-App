import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ClipboardList, CheckSquare, TrendingUp, History, Ruler,
  MessageCircle, Salad, User, Settings, LogOut, ChevronsUpDown,
} from 'lucide-react';

interface NavItem { label: string; path: string; icon: React.ElementType; soon?: boolean; }

const SECTIONS: { label: string; items: NavItem[] }[] = [
  { label: 'Overview', items: [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] },
  {
    label: 'Training',
    items: [
      { label: 'My Plan', path: '/plan', icon: ClipboardList },
      { label: 'Log a Session', path: '/log', icon: CheckSquare },
      { label: 'Progress', path: '/progress', icon: TrendingUp },
      { label: 'Workout History', path: '/history', icon: History, soon: true },
      { label: 'Body Measurements', path: '/measurements', icon: Ruler, soon: true },
    ],
  },
  {
    label: 'Coaching',
    items: [
      { label: 'Coach Chat', path: '/coach', icon: MessageCircle, soon: true },
      { label: 'Nutrition', path: '/nutrition', icon: Salad, soon: true },
    ],
  },
];

const ROLE_STYLES: Record<string, string> = {
  member: 'bg-secondary text-secondary-foreground',
  trainer: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  super_admin: 'bg-primary/10 text-primary',
};

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();

  const initials = (user?.fullName || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
<Sidebar collapsible="icon"
  style={
    {
      "--sidebar-width": "14rem",       // expanded width
      "--sidebar-width-icon": "3rem",   // collapsed width
    } as React.CSSProperties
  }
>
<SidebarHeader>
  <Link
    to="/dashboard"
    className="flex items-center py-1.5 text-lg font-bold tracking-tight"
  >
<div
  className="h-8 w-8 mr-2 flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-sm inline-block align-middle"
  style={{ backgroundImage: "url('/logo.svg')" }}
></div>


    <span className="group-data-[collapsible=icon]:hidden">
      Fitness App<span className="text-primary">.</span>
    </span>
  </Link>
</SidebarHeader>

      <SidebarContent>
        {SECTIONS.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  {item.soon ? (
                    <SidebarMenuButton disabled className="opacity-50">
                      <item.icon />
                      <span>{item.label}</span>
                      <Badge variant="outline" className="ml-auto text-[10px] group-data-[collapsible=icon]:hidden">SOON</Badge>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.label}>
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{user?.fullName}</span>
                <Badge className={`w-fit text-[10px] px-1.5 py-0 h-4 capitalize ${ROLE_STYLES[user?.role || 'member']}`}>
                  {user?.role?.replace('_', ' ')}
                </Badge>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
