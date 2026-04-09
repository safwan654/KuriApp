"use client"

import Shell from "@/components/layout/Shell";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { reportService } from "@/lib/services/reportService";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, Receipt, Clock, ArrowLeft, BarChart3, PieChart } from "lucide-react";
import Link from "next/link";

export default function StatementsPage() {
  const { user } = useAuth();
  const [financials, setFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const stats = await reportService.getUserFinancials(user.uid);
      setFinancials(stats);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) return null;

  const maxValue = Math.max(financials.totalContributed, financials.totalReceived, financials.pendingPayments, 1000);
  const getProgress = (val: number) => (val / maxValue) * 100;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto py-10 pb-32">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest mb-8 hover:text-indigo-600 transition-all">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">Financial Statement 📊</h1>
            <p className="text-slate-500 font-bold text-lg leading-tight">Accurate breakdown of your investment and earnings across all KuriHub modules.</p>
        </header>

        {/* Totals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <SummaryCard label="Total Given" amount={financials.totalContributed} icon={<TrendingUp className="text-indigo-500" />} color="indigo" />
            <SummaryCard label="Total Gained" amount={financials.totalReceived} icon={<Wallet className="text-green-500" />} color="green" />
            <SummaryCard label="Current Pending" amount={financials.pendingPayments} icon={<Clock className="text-amber-500" />} color="amber" />
        </div>

        {/* Visual Graph Section */}
        <div className="premium-card p-10 mb-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                   <h2 className="text-2xl font-black text-slate-800">Visual Insights 📈</h2>
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Growth & Commitment Ratio</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-300">
                   <BarChart3 />
                </div>
            </div>

            <div className="space-y-12">
                <BarItem label="Contributions (Total Given)" value={financials.totalContributed} color="#6366f1" percent={getProgress(financials.totalContributed)} />
                <BarItem label="Returns (Total Received)" value={financials.totalReceived} color="#22c55e" percent={getProgress(financials.totalReceived)} />
                <BarItem label="Liability (Pending)" value={financials.pendingPayments} color="#f59e0b" percent={getProgress(financials.pendingPayments)} />
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl">
                       {financials.totalContributed > 0 ? Math.round((financials.totalReceived / financials.totalContributed) * 100) : 0}%
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800">Return Rate</h4>
                        <p className="text-slate-400 text-sm font-bold">Profit/Contribution ratio</p>
                    </div>
                </div>
                <div className="text-center md:text-right">
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Net Financial Health</p>
                   <h3 className={`text-4xl font-black ${financials.totalReceived > financials.totalContributed ? 'text-green-600' : 'text-slate-800'}`}>
                      ₹{(financials.totalReceived - financials.totalContributed).toLocaleString()}
                   </h3>
                </div>
            </div>
        </div>

        {/* Details Note */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32" />
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-white shrink-0 shadow-2xl">
               <Receipt size={32} />
            </div>
            <div>
               <h3 className="text-2xl font-black mb-2">Full History Download Coming Soon! 🚀</h3>
               <p className="text-slate-400 font-medium opacity-80">We are indexing your previous Malayalam Kuri cycles. You will soon be able to export this as a PDF statement for bank or personal use.</p>
            </div>
        </div>
      </div>
    </Shell>
  );
}

function SummaryCard({ label, amount, icon, color }: { label: string, amount: number, icon: any, color: string }) {
    return (
        <div className="premium-card p-8 group hover:scale-[1.02] transition-all bg-white">
            <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</p>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-all shadow-inner">
                   {icon}
                </div>
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-2 italic font-display">₹{amount.toLocaleString()}</h3>
            <div className={`h-1 w-12 bg-${color}-500 rounded-full`} />
        </div>
    )
}

function BarItem({ label, value, color, percent }: { label: string, value: number, color: string, percent: number }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4 font-black text-sm text-slate-600 tracking-tight">
                <span>{label}</span>
                <span className="text-slate-900">₹{value.toLocaleString()}</span>
            </div>
            <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 shadow-inner p-0.5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                    className="h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    )
}
