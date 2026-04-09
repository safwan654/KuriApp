"use client"

import Shell from "@/components/layout/Shell";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { groupService } from "@/lib/services/groupService";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ChevronDown } from "lucide-react";

export default function EditGroupPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    hostName: "",
    date: "",
    status: "Upcoming"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [group, groupMembers] = await Promise.all([
          groupService.getGroupDetails(id),
          groupService.getGroupMembers(id)
        ]);
        setFormData({
          name: group.name,
          hostName: group.hostName || "",
          date: group.date?.toDate?.().toISOString().split('T')[0] || group.date || "",
          status: group.status || "Upcoming"
        });
        setMembers(groupMembers);
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
      await groupService.updateGroup(id, formData);
      router.push(`/koottukuri/${id}`);
    } catch (err: any) {
      alert(err.message);
      setSaving(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
     </div>
  );

  return (
    <Shell>
      <div className="max-w-2xl mx-auto pt-10 pb-20 px-4">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden animate-up border border-slate-50">
          <div className="bg-gradient-to-br from-[#8E2DE2] to-[#6366f1] p-12 text-center text-white relative">
            <h1 className="text-4xl font-black mb-2 flex items-center justify-center gap-3">
              Function Edit Cheyyu 😎
            </h1>
            <p className="text-white/70 font-bold opacity-80">Title, host, date onnudi set aakam machane! 🔥</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-10 bg-white">
            <div className="space-y-3">
              <label className="block text-base font-black text-slate-800 ml-1">Function Name 👀</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-purple-600 transition-all outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-base font-black text-slate-800 ml-1">Innu Ivante Day 😎 🔥</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-purple-600 transition-all outline-none appearance-none cursor-pointer"
                  value={formData.hostName}
                  onChange={e => setFormData({ ...formData, hostName: e.target.value })}
                >
                  <option value="">Select Host...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-base font-black text-slate-800 ml-1">Eppazha ivante paripaadi? 📅</label>
              <input 
                type="date"
                required
                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-purple-600 transition-all outline-none"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-base font-black text-slate-800 ml-1">Entha Scene (Status)? 👀</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg focus:border-purple-600 transition-all outline-none appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="PaymentOpen">PaymentOpen</option>
                  <option value="Closed">Closed</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-6 rounded-3xl font-black text-2xl text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4"
              style={{ background: 'linear-gradient(135deg, #8E2DE2, #6366f1)' }}
            >
              {saving ? <Loader2 className="animate-spin mx-auto" /> : <>Save Cheyyu ✅ 🔥</>}
            </button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
