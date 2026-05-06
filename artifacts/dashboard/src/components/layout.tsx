import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { clearToken } from "@/lib/token";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Início", icon: LayoutDashboard },
  { href: "/reports", label: "Relatórios", icon: FileText },
  { href: "/alerts", label: "Alertas", icon: AlertTriangle },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    clearToken();
    setLocation("/login");
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-[430px] mx-auto overflow-hidden relative">
      {/* Navy header — matches mobile header (#0F1923) */}
      <header
        className="flex items-center justify-between px-5 py-3 shrink-0 z-10"
        style={{ backgroundColor: "#0F1923" }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" style={{ color: "#FF6B2C" }} />
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: "#FF6B2C" }}>
              ViaSafe
            </p>
            <p className="text-[10px] leading-tight" style={{ color: "#8899A6" }}>
              Cuide do trânsito da sua cidade
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
          style={{ color: "#8899A6" }}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F4F6F9" }}>
        {children}
      </main>

      {/* Bottom tab bar — matches mobile tabBar (#FFFFFF / border #DDE3EC) */}
      <nav
        className="shrink-0 grid grid-cols-3 z-10"
        style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #DDE3EC" }}
      >
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-3 gap-1 transition-colors"
              style={{ color: isActive ? "#FF6B2C" : "#637080" }}
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
