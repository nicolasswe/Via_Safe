import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { clearToken } from "@/lib/token";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  LogOut,
  ShieldAlert,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reports", label: "Relatórios", icon: FileText },
  { href: "/alerts", label: "Alertas", icon: AlertTriangle },
];

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    clearToken();
    setLocation("/login");
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background overflow-hidden relative shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <span className="font-bold text-base tracking-tight">ViaSafe</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom tab bar */}
      <nav className="shrink-0 border-t border-border bg-card grid grid-cols-3 z-10">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
