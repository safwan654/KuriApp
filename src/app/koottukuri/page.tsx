"use client"

import Shell from "@/components/layout/Shell";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { groupService } from "@/lib/services/groupService";
import { Group } from "@/types";
import { Plus, Users, ChevronRight, Hash, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function KoottukuriPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      groupService.getMyGroups(user.uid).then(res => {
        setGroups(res);
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
              Koottu <span className="text-purple-600">Kuri</span> 👨‍👩‍👧‍👦
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Marriages and functions-inu vendi ulla nammude swantham collection system. 🔥 
            </p>
          </div>
          
          <Link href="/koottukuri/create" className="btn-primary-gradient from-purple-600 to-indigo-600 px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-sm whitespace-nowrap">
            <Plus size={20} />
            PUTHIYA GROUP UNDAKKAM 🚀
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="premium-card p-20 text-center bg-white max-w-3xl mx-auto">
            <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Users className="text-slate-200" size={48} />
            </div>
            <h2 className="text-3xl font-black mb-4">Ithu vare group-il onnum ille? 👀</h2>
            <p className="text-slate-500 mb-12 text-lg font-medium leading-relaxed">
              Looks like you haven&apos;t joined any Koottukuri groups yet. Create a group for your next function or join your team! 🤝💍
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/koottukuri/create" className="btn-primary-gradient from-purple-600 to-indigo-600 px-10 py-5 rounded-full font-black text-lg">
                Create Function Group 🚀
              </Link>
              <button className="px-10 py-5 rounded-full border border-slate-200 bg-white text-slate-600 font-black hover:bg-slate-50 transition-colors text-lg">
                Join with Code 🔗
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group, idx) => (
              <GroupCard key={idx} group={group} index={idx} />
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}

function GroupCard({ group, index }: { group: Group, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/koottukuri/${group.id}`}>
        <div className="premium-card p-10 group hover:border-purple-200 transition-all duration-300 h-full flex flex-col">
          <div className="flex justify-between items-start mb-8">
             <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <Heart size={28} />
             </div>
             <span className="badge bg-purple-50 text-purple-600 border border-purple-100 rounded-full px-5 py-1.5 font-black text-xs uppercase tracking-widest shadow-sm shadow-purple-100">
                ACTIVE 😎
             </span>
          </div>
          
          <h3 className="text-3xl font-black mb-3 group-hover:text-purple-600 transition-colors uppercase tracking-tight truncate">{group.name}</h3>
          
          <div className="space-y-4 mb-10 flex-grow">
            <p className="text-slate-500 font-medium line-clamp-2">{group.description || "No description provided."}</p>
            <div className="flex items-center gap-3 text-slate-800 font-black pt-4 border-t border-slate-50">
              <span className="text-xl tracking-tight">₹{group.contributionAmount?.toLocaleString()} <span className="text-slate-400 font-bold text-sm lowercase">/ event</span></span>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
            <span className="text-xs font-black uppercase text-purple-600/50 tracking-[0.2em] group-hover:text-purple-600 transition-colors">Details Kaanam 👀</span>
            <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
