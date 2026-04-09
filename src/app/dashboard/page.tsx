"use client"

import Shell from "@/components/layout/Shell";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Users, ArrowUpRight, Plus, ChevronRight, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { kuriService } from "@/lib/services/kuriService";
import { groupService } from "@/lib/services/groupService";
import { reportService } from "@/lib/services/reportService";

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [data, setData] = useState<{ groups: any[], cycles: any[] }>({ groups: [], cycles: [] });
  const [financials, setFinancials] = useState({ totalContributed: 0, totalReceived: 0, pendingPayments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [groups, cycles, stats] = await Promise.all([
          groupService.getMyGroups(user.uid),
          kuriService.getMyCycles(user.uid),
          reportService.getUserFinancials(user.uid)
        ]);
        setData({ groups, cycles });
        setFinancials(stats);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const hasData = data.groups.length > 0 || data.cycles.length > 0;


  if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
     </div>
  );

  return (
    <Shell>
      <div className="max-w-7xl mx-auto pb-20">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-up">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Hello, <span className="text-indigo-600">{profile?.displayName?.split(' ')?.[0]}!</span> 😎
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              {hasData ? "Ellam set-alle machane? Ivide ellam kaank! 🔥" : "Welcome bruhh! Thudangan ready-alle? 🔥"}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/traditional/create" className="btn-primary-gradient px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-sm uppercase tracking-widest shadow-2xl">
              <Plus size={18} /> New Kuri
            </Link>
          </div>
        </header>

        {!hasData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0"><Info size={24} /></div>
             <div>
                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-1">Demo Mode Active 💡</h4>
                <p className="text-slate-500 font-bold text-sm">Ivathe data motham demo aanu. Oru Kuri thudangumbo real data ivide varum! 😎</p>
             </div>
             <div className="md:ml-auto flex gap-3">
                <Link href="/traditional/create" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase">Start Traditional</Link>
                <Link href="/koottukuri/create" className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-black text-[10px] uppercase">Start Koottukuri</Link>
             </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ModuleCard 
            title="Traditional Kuri"
            count={data.cycles.length}
            desc="Automated draws and pool management."
            icon={<Wallet className="text-indigo-600" size={24} />}
            href="/traditional"
            color="indigo"
          />
          <ModuleCard 
            title="Function Group"
            count={data.groups.length}
            desc="Kootukuri for marriages and events."
            icon={<Users className="text-purple-600" size={24} />}
            href="/koottukuri"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 premium-card p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">Recent Activities 👀</h2>
              <button className="text-indigo-600 font-black text-sm hover:underline">View All</button>
            </div>
            
            <div className="space-y-6">
              {hasData ? (
                 <div className="py-12 text-center text-slate-400 font-bold italic bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    Ivide onnum illa ippo... Activities on the way! 🚀
                 </div>
              ) : (
                <>
                  <ActivityItem title="Paisa Paid - Round 4" group="Sunday Mafia Kuri" time="2 hours ago" amount="₹5,000" status="pending" />
                  <ActivityItem title="New Member Added" group="Marriage Fund 2026" time="5 hours ago" amount="Member: Shibu" status="success" />
                  <ActivityItem title="Kuri Draw Winner" group="Legacy Friends Group" time="Yesterday" amount="Winner: Safwan" status="success" />
                </>
              )}
            </div>
          </div>

          <div className="premium-card p-10 bg-slate-900 text-white border-0 shadow-2xl shadow-indigo-100/20">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
              Kuri Summary <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">(Total Hub)</span>
            </h2>
            
            <div className="space-y-8">
              <StatItem label="Total Contributed" amount={`₹${financials.totalContributed.toLocaleString()}`} color="indigo" percent="65%" />
              <StatItem label="Total Received" amount={`₹${financials.totalReceived.toLocaleString()}`} color="purple" percent="40%" />
              <StatItem label="Pending Payments" amount={`₹${financials.pendingPayments.toLocaleString()}`} color="orange" percent="15%" />
            </div>

            <Link href="/statements" className="w-full mt-10 py-5 rounded-3xl bg-white/10 hover:bg-white/15 border border-white/10 font-black transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
              Full Statement Kaank 😎 <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </Shell>
  );
}

function ModuleCard({ title, desc, icon, href, color, count }: { title: string, desc: string, icon: any, href: string, color: string, count: number }) {
  return (
    <Link href={href}>
      <motion.div whileHover={{ scale: 1.01, y: -4 }} className="premium-card p-8 group relative overflow-hidden bg-white hover:border-indigo-100 transition-all">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -mr-16 -mt-16 rounded-full transition-all group-hover:scale-150`} />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:bg-white transition-colors`}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                 <h3 className="text-2xl font-black group-hover:text-indigo-600 transition-colors">{title}</h3>
                 <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-indigo-100">{count} Active</span>
              </div>
              <p className="text-slate-500 font-medium">{desc}</p>
            </div>
          </div>
          <div className="p-3 rounded-full bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
            <ArrowUpRight size={24} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function ActivityItem({ title, group, time, amount, status }: { title: string, group: string, time: string, amount: string, status: string }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors rounded-2xl px-4">
      <div className="flex items-center gap-5">
        <div className={`w-3 h-3 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-orange-500'} shadow-lg`} />
        <div>
          <h4 className="font-bold text-slate-800">{title}</h4>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{group} • {time}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="font-black text-slate-900 border-b-2 border-slate-100">{amount}</span>
      </div>
    </div>
  );
}

function StatItem({ label, amount, color, percent }: { label: string, amount: string, color: string, percent: string }) {
  return (
    <div>
      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-3 ml-1">{label}</p>
      <h3 className={`text-3xl font-black text-white italic font-display`}>{amount}</h3>
      <div className={`h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden shadow-inner`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: percent }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ backgroundColor: color === 'indigo' ? '#6366f1' : color === 'purple' ? '#a855f7' : '#f59e0b' }}
          className={`h-full shadow-[0_0_15px_rgba(99,102,241,0.5)]`} 
        />
      </div>
    </div>
  );
}

