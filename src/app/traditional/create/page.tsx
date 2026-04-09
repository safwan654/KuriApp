"use client"

import Shell from "@/components/layout/Shell";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { kuriService } from "@/lib/services/kuriService";
import { useRouter } from "next/navigation";
import { Wallet, Calendar, Users, ArrowLeft, Loader2, Sparkles, Hash } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateKuriPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contributionAmount: 2500,
    totalMembers: 12,
    frequency: "Monthly",
    startDate: new Date().toISOString().split('T')[0],
    firstDrawDate: new Date().toISOString().split('T')[0],
    hasForemanCommission: false,
    commissionPercentage: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      const id = await kuriService.createCycle(user.uid, {
        ...formData,
        contributionAmount: Number(formData.contributionAmount),
        totalMembers: Number(formData.totalMembers),
      }, profile.displayName);
      router.push(`/traditional/${id}`);
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-16 border border-slate-50 flex flex-col items-center">
          
          <div className="px-6 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 font-black text-xs uppercase mb-8 shadow-sm">
             Teng! Set aakkam 🔥
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 text-center">Puthia Kuri Thudangaam!</h1>
          <p className="text-slate-400 font-medium mb-12 text-center leading-tight">Enter the details for your new traditional Kuri cycle.</p>

          <form onSubmit={handleSubmit} className="w-full space-y-10">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-tight">Kuri Name (E.g. Onam Kuri 2026)</label>
              <input 
                type="text" 
                required
                placeholder="eg: Kaltaanam"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-tight">Total Members</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 12"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                  value={formData.totalMembers}
                  onChange={e => setFormData({ ...formData, totalMembers: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-tight">Amount Per Member</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 2500"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                  value={formData.contributionAmount}
                  onChange={e => setFormData({ ...formData, contributionAmount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-tight h-10 flex items-end">Frequency</label>
                <select 
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none cursor-pointer appearance-none"
                  value={formData.frequency}
                  onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-tight h-10 flex items-end">Start Date</label>
                <input 
                  type="date"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-tight h-10 flex items-end gap-2 flex-wrap">
                   Draw Date (Last Date)
                   <div className="w-3 h-3 rounded-full bg-[#E91E63] shrink-0 mb-1" />
                </label>
                <input 
                  type="date"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                  value={formData.firstDrawDate}
                  onChange={e => setFormData({ ...formData, firstDrawDate: e.target.value })}
                />
              </div>

            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-8 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all"
                   onClick={() => setFormData({ ...formData, hasForemanCommission: !formData.hasForemanCommission })}>
                 <div>
                   <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">Add Foreman Commission?</h4>
                   <p className="text-slate-400 font-bold text-sm tracking-tight leading-snug">Take a small percentage for managing the Kuri.</p>
                 </div>
                 <div className={`w-14 h-8 rounded-full transition-all relative ${formData.hasForemanCommission ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.hasForemanCommission ? 'left-7' : 'left-1'} shadow-sm`} />
                 </div>
              </div>

              <AnimatePresence>
                {formData.hasForemanCommission && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-indigo-50/30 p-8 rounded-3xl border-2 border-dashed border-indigo-100">
                      <label className="block text-xs font-black text-indigo-600 mb-3 uppercase tracking-widest ml-1">Commission Percentage (%)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          placeholder="e.g. 5"
                          className="w-full bg-white border-2 border-white rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                          value={formData.commissionPercentage || ""}
                          onChange={e => setFormData({ ...formData, commissionPercentage: Number(e.target.value) })}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-indigo-200 text-xl">%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary-gradient w-full py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 shadow-2xl mt-4"
              style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Thudangaam 🚀</>}
            </button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
