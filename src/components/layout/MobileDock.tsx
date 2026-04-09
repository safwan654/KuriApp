"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Users, UserCircle } from "lucide-react";

const NAV_ITEMS = [
  { label: 'Dash', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Traditional', href: '/traditional', icon: Wallet },
  { label: 'Koottukuri', href: '/koottukuri', icon: Users },
  { label: 'Profile', href: '/profile', icon: UserCircle },
];

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-sm">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(item.href);
            
          return (
            <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-1 group">
               <div className={`p-2.5 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-600/40' : 'text-slate-400'}`}>
                  <item.icon size={20} />
               </div>
               {isActive && (
                 <div className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full" />
               )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
