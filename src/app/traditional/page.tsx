"use client"

import Shell from "@/components/layout/Shell";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { kuriService } from "@/lib/services/kuriService";
import { KuriCycle } from "@/types";
import { Plus, Wallet, ChevronRight, Hash, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TraditionalKuriPage() {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<KuriCycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      kuriService.getMyCycles(user.uid).then(res => {
        setCycles(res);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <Shell>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Traditional <span className="text-indigo-600">Kuri</span> 😎
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Nammude traditional kuri management made easy. Draws, payments and winners all in one place. 🔥 
            </p>
          </div>
          
          <Link href="/traditional/create" className="btn-primary-gradient px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-sm whitespace-nowrap">
            <Plus size={20} />
            PUTHIYA KURI UNDAKKAM 🚀
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cycles.length === 0 ? (
          <div className="premium-card p-20 text-center bg-white max-w-3xl mx-auto">
            <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Wallet className="text-slate-200" size={48} />
            </div>
            <h2 className="text-3xl font-black mb-4">Enthada ithu? Kuri onnum ille? 👀</h2>
            <p className="text-slate-500 mb-12 text-lg font-medium leading-relaxed">
              Looks like you haven&apos;t joined any Kuri cycles yet. Start your own cycle today or join using an invite code from your friends. 🎲🤝
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/traditional/create" className="btn-primary-gradient px-10 py-5 rounded-full font-black text-lg">
                Create My First Kuri 🚀
              </Link>
              <button className="px-10 py-5 rounded-full border border-slate-200 bg-white text-slate-600 font-black hover:bg-slate-50 transition-colors text-lg">
                Join with Code 🔗
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cycles.map((cycle, idx) => (
              <KuriCard key={idx} cycle={cycle} index={idx} />
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}

function KuriCard({ cycle, index }: { cycle: KuriCycle, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/traditional/${cycle.id}`}>
        <div className="premium-card p-10 group hover:border-indigo-200 transition-all duration-300 h-full flex flex-col">
          <div className="flex justify-between items-start mb-8">
             <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <Hash size={28} />
             </div>
             <span className="badge bg-green-50 text-green-600 border border-green-100 rounded-full px-5 py-1.5 font-black text-xs uppercase tracking-widest shadow-sm shadow-green-100">
                ACTIVE 😎
             </span>
          </div>
          
          <h3 className="text-3xl font-black mb-3 group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate">{cycle.name}</h3>
          
          <div className="space-y-4 mb-10 flex-grow">
            <div className="flex items-center gap-3 text-slate-400 font-bold">
              <Users size={18} />
              <span className="text-base">{cycle.totalMembers} Members Pool</span>
            </div>
            <div className="flex items-center gap-3 text-slate-800 font-black">
              <Wallet size={18} className="text-indigo-600" />
              <span className="text-xl tracking-tight">₹{cycle.contributionAmount.toLocaleString()} <span className="text-slate-400 font-bold text-sm lowercase">/ monthly</span></span>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
            <span className="text-xs font-black uppercase text-indigo-600/50 tracking-[0.2em] group-hover:text-indigo-600 transition-colors">Details Kaanam 👀</span>
            <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
