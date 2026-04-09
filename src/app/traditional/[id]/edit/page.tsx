"use client"

import Shell from "@/components/layout/Shell";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { kuriService } from "@/lib/services/kuriService";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ChevronDown } from "lucide-react";
import { KuriCycle, KuriMember } from "@/types";

export default function EditKuriPage() {
  const { id } = useParams() as { id: string };
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<KuriMember[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    contributionAmount: 2500,
    totalMembers: 12,
    frequency: "Monthly",
    startDate: "",
    firstDrawDate: "",
    defaultHostId: "",
    hasForemanCommission: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cycle, membersList] = await Promise.all([
          kuriService.getCycleDetails(id),
          kuriService.getCycleMembers(id)
        ]);
        
        setFormData({
          name: cycle.name,
          contributionAmount: cycle.contributionAmount,
          totalMembers: cycle.totalMembers,
          frequency: cycle.frequency || "Monthly",
          startDate: cycle.startDate?.toDate?.().toISOString().split('T')[0] || cycle.startDate,
          firstDrawDate: cycle.firstDrawDate?.toDate?.().toISOString().split('T')[0] || cycle.firstDrawDate,
          defaultHostId: cycle.defaultHostId || "",
          hasForemanCommission: cycle.hasForemanCommission || false
        });
        setMembers(membersList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await kuriService.updateCycle(id, formData);
      router.push(`/traditional/${id}`);
    } catch (err: any) {
      alert(err.message);
      setSaving(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
     </div>
  );

  return (
    <Shell>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden animate-up border border-slate-50">
          <div className="p-16 flex flex-col items-center">
            <div className="px-6 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase mb-10 shadow-sm">
                Re-configure 🔥
            </div>

            <h1 className="text-5xl font-black text-slate-800 mb-2 text-center">Edit {formData.name}</h1>
            <p className="text-slate-400 font-bold mb-14 text-center">Update naming and commission rates.</p>

            <form onSubmit={handleSubmit} className="w-full space-y-10 text-left">
              <div className="space-y-3">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase">Kuri Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase">Total Members</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                    value={formData.totalMembers}
                    onChange={e => setFormData({ ...formData, totalMembers: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase">Amount Per Member</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                    value={formData.contributionAmount}
                    onChange={e => setFormData({ ...formData, contributionAmount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase">Frequency</label>
                  <select 
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase">Start Date</label>
                  <input 
                    type="date"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-700 ml-1 uppercase flex items-center gap-2">
                     Draw Date
                     <div className="w-3 h-3 rounded-full bg-[#E91E63]" />
                  </label>
                  <input 
                    type="date"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none"
                    value={formData.firstDrawDate}
                    onChange={e => setFormData({ ...formData, firstDrawDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-black text-slate-700 ml-1 uppercase">Default Host (For Payments) 😎</label>
                <div className="relative">
                  <select 
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                    value={formData.defaultHostId}
                    onChange={e => setFormData({ ...formData, defaultHostId: e.target.value })}
                  >
                    <option value="">Select Host...</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
                <p className="mt-2 text-slate-400 font-bold text-[11px] leading-relaxed">Winner illatthorukk host-inte UPI aakum show cheyyuka! 🔥</p>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all border border-slate-100"
                   onClick={() => setFormData({ ...formData, hasForemanCommission: !formData.hasForemanCommission })}>
                 <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">Has Foreman Commission?</h4>
                 <div className={`w-14 h-8 rounded-full transition-all relative ${formData.hasForemanCommission ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.hasForemanCommission ? 'left-7' : 'left-1'} shadow-sm`} />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full py-6 rounded-[28px] font-black text-2xl text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
              >
                {saving ? <Loader2 className="animate-spin mx-auto" /> : <>Urakkaam! 🚀</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
