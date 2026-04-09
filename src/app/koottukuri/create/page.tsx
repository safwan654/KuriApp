"use client"

import Shell from "@/components/layout/Shell";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { groupService } from "@/lib/services/groupService";
import { useRouter } from "next/navigation";
import { Users, DollarSign, Shield, ArrowLeft, Loader2, PartyPopper, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreateGroupPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contributionAmount: 50,
    requireAdminApproval: true,
    description: "",
    eventType: "Marriage"
  });

  const eventTypes = [
     { id: 'Marriage', label: 'Marriage 💍', tip: 'Ithu marriage-inu vendi ulla collection-u aanu! Events undakkam, paisa pirkkaam, mass aakkaam! 🔥' },
     { id: 'Nikkah', label: 'Nikkah 🌙', tip: 'Nikkah scene set aakan ulla collection aanu Bruhh. Ellarum onnichi nilku! 🤝' },
     { id: 'House Warming', label: 'House Warming 🏠', tip: 'Puthiya veedu, puthiya thudakkam! Cheriya oru sahayam teaminte vaka. 😎' },
     { id: 'Loan Pay', label: 'Loan Pay 🏦', tip: 'Adaykkura date marakkalle! Groupile ellarum onnichu adaykkan ithu set aanu. 💸' },
     { id: 'Party', label: 'Party 🥳', tip: 'Enthparty aaykkotte, bill split cheyyan KuriHub-ile ee module upayogikku! 🔥' },
     { id: 'Others', label: 'Others 🚀', tip: 'Enthu function aayalum scene illa, Matrix tracker ellam set aaki tharum! 😎' },
  ];

  const currentTip = eventTypes.find(e => e.id === formData.eventType)?.tip || eventTypes[0].tip;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      const id = await groupService.createGroup(user.uid, {
        ...formData,
        contributionAmount: Number(formData.contributionAmount),
      }, profile.displayName);
      router.push(`/koottukuri/${id}`);
    } catch (err: any) {
      console.error(err);
      alert("Error creating Group: " + err.message);
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <Link href="/koottukuri" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 font-bold mb-10 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Purathekku pokam 🏃‍♂️
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-slate-900 leading-tight">
            Group Create <span className="text-purple-600">Cheyyu 🔥</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg italic tracking-tight">Scene full set aakam machane! 😎🔥🚀</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="premium-card p-10 space-y-8 animate-up">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Event Type Entha? 👀</label>
                <select 
                   required
                   className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-black text-lg focus:ring-2 focus:ring-purple-600 transition-all outline-none appearance-none cursor-pointer"
                   value={formData.eventType}
                   onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                >
                   {eventTypes.map(et => (
                      <option key={et.id} value={et.id}>{et.label}</option>
                   ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Group Name Para 👀</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Wedding Kuri 2024 🎉"
                  className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-bold text-lg focus:ring-2 focus:ring-purple-600 transition-all outline-none shadow-inner"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Kuri Amount (₹) 💰</label>
                <div className="relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">₹</div>
                   <input 
                    type="number" 
                    required
                    className="w-full bg-slate-50 border-0 rounded-2xl pl-12 pr-6 py-4 font-bold text-lg focus:ring-2 focus:ring-purple-600 transition-all outline-none shadow-inner"
                    value={formData.contributionAmount}
                    onChange={e => setFormData({ ...formData, contributionAmount: Number(e.target.value) })}
                  />
                </div>
                <p className="mt-2 text-[10px] font-bold text-slate-400 italic">Ellarum ithu kodukkendi varum ketto 😅</p>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
                 <div>
                    <h4 className="font-black text-slate-800 flex items-center gap-2">
                       <Shield size={16} className="text-purple-600" />
                       Admin Approval 👨‍💻
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">Nee nokanam join aavunnavare.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                       type="checkbox" 
                       className="sr-only peer"
                       checked={formData.requireAdminApproval}
                       onChange={e => setFormData({ ...formData, requireAdminApproval: e.target.checked })}
                    />
                    <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                 </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary-gradient from-purple-600 to-indigo-600 w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-purple-200"
              >
                {loading ? <Loader2 className="animate-spin" /> : <PartyPopper />}
                Group Undakkam 🔥
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-8 animate-up delay-100">
            <div className="premium-card p-10 bg-slate-900 text-white border-0 shadow-2xl shadow-purple-100 flex flex-col justify-between h-auto min-h-[350px]">
              <div>
                <h2 className="text-2xl font-black mb-8">Group Overview 📝</h2>
                <div className="space-y-8">
                   <div className="pb-4 border-b border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Event Selection</p>
                      <p className="text-2xl font-black text-purple-400 capitalize italic tracking-tight">{formData.eventType}</p>
                   </div>
                   <div className="pb-4 border-b border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Standard Share</p>
                      <p className="text-3xl font-black tracking-tighter text-white">₹{formData.contributionAmount.toLocaleString()}</p>
                   </div>
                </div>
              </div>
              
              <div className="mt-12 p-8 rounded-[32px] bg-white/5 border border-white/5 text-sm font-bold leading-relaxed text-slate-400">
                <span className="text-white block mb-2 font-black italic text-base flex items-center gap-2">
                   <Sparkles size={16} className="text-purple-400" />
                   Tip: 😎
                </span>
                {currentTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
