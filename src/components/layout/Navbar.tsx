"use client"

import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Wallet, Users, Menu } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { profile } = useAuth();
  const pathname = usePathname();

  if (!profile) return null;

  return (
    <nav className="nav-blur px-4 md:px-10 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="text-2xl font-black tracking-tight text-indigo-600">
        KuriHub
      </Link>
      
      <div className="hidden lg:flex items-center gap-10">
        <NavLink href="/dashboard" active={pathname === "/dashboard"} icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavLink href="/traditional" active={pathname.startsWith("/traditional")} icon={<Wallet size={18} />} label="Traditional Kuri" />
        <NavLink href="/koottukuri" active={pathname.startsWith("/koottukuri")} icon={<Users size={18} />} label="Koottukuri" />
      </div>

      <div className="flex items-center gap-4">
        <Link href="/profile" className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {profile?.displayName?.[0]?.toUpperCase() || "?"}
          </div>
          <span className="text-sm font-black text-slate-700 hidden sm:block">@{profile?.displayName?.split(' ')?.[0]?.toLowerCase()}</span>
        </Link>
        <button 
          onClick={() => signOut(auth)}
          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}

function NavLink({ href, active, icon, label }: { href: string, active: boolean, icon: any, label: string }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2.5 font-black text-xs uppercase tracking-widest transition-all ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900 group'}`}
    >
      <span className={`${active ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-400'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
