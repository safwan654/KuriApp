"use client"

import { useAuth } from "@/context/AuthContext";
import Shell from "@/components/layout/Shell";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { kuriService } from "@/lib/services/kuriService";
import { KuriCycle, KuriMember, KuriRound, KuriPayment } from "@/types";
import { 
  Wallet, Users, LayoutDashboard, Table as TableIcon, 
  ChevronRight, Hash, Star, Trophy, Calendar, 
  UserPlus, Shield, Trash2, Copy, CheckCircle2,
  MoreVertical, RefreshCw, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function KuriDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user, profile } = useAuth();
  const router = useRouter();

  const [cycle, setCycle] = useState<KuriCycle | null>(null);
  const [members, setMembers] = useState<KuriMember[]>([]);
  const [rounds, setRounds] = useState<KuriRound[]>([]);
  const [payments, setPayments] = useState<KuriPayment[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [drawingName, setDrawingName] = useState("");

  const isAdmin = useMemo(() => {
    return members.find(m => m.uid === user?.uid)?.isAdmin || false;
  }, [members, user]);

  const fetchData = async () => {
    try {
      const [c, m, r, p] = await Promise.all([
        kuriService.getCycleDetails(id),
        kuriService.getCycleMembers(id),
        kuriService.getCycleRounds(id),
        kuriService.getCyclePayments(id)
      ]);
      setCycle(c);
      setMembers(m);
      setRounds(r);
      setPayments(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const copyInviteLink = () => {
    const link = `${window.location.origin}/traditional/join/${cycle?.inviteCode}`;
    navigator.clipboard.writeText(link);
    alert("Invite Link Copied! Send it to your friends on WhatsApp 🚀");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!cycle) return <div className="p-20 text-center font-black">Cycle not found! 🛑</div>;

  return (
    <Shell>
      <div className="max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <header className="premium-card p-10 bg-slate-900 text-white border-0 mb-12 shadow-2xl shadow-indigo-200/50">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <nav className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
                <Link href="/traditional" className="hover:text-white transition-colors">Traditional Kuri</Link>
                <ChevronRight size={14} />
                <span className="text-white">{cycle.name}</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase">{cycle.name} 🔥</h1>
              
              <div className="flex flex-wrap gap-8">
                <HeaderStat icon={<Wallet size={20} className="text-indigo-400" />} label="Kuri Pool" value={`₹${cycle.grandTotalPool?.toLocaleString() || "0"}`} />
                <HeaderStat icon={<Users size={20} className="text-purple-400" />} label="Team Size" value={`${members.length} Members`} />
                <HeaderStat icon={<Star size={20} className="text-yellow-400" />} label="Monthly" value={`₹${cycle.contributionAmount?.toLocaleString()}`} />
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end justify-center gap-4">
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.host}/traditional/join/${cycle.inviteCode}`);
                    alert("Invite Link Copied! Send it to your friends on WhatsApp 🚀");
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-black text-xs flex items-center gap-2 transition-all uppercase tracking-widest"
                >
                  <Copy size={16} />
                  Link 🔗
                </button>
                {isAdmin && (
                  <>
                    <Link 
                      href={`/traditional/${id}/edit`}
                      className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs flex items-center gap-2 transition-all uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                    >
                      Edit 📝
                    </Link>
                    <button 
                      onClick={async () => {
                        if (confirm("Eda, ithu delete cheyyanam ennurappano? 🛑 (Delete this Kuri cycle?)")) {
                          await kuriService.deleteCycle(id);
                          router.push("/traditional");
                        }
                      }}
                      className="px-6 py-3 rounded-xl bg-red-500/80 hover:bg-red-600 text-white font-black text-xs flex items-center gap-2 transition-all uppercase tracking-widest"
                    >
                      Delete 🛑
                    </button>
                  </>
                )}
              </div>
              <div className="px-6 py-2 rounded-full bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20">
                CYCLE IS {cycle.status} 😎
              </div>
            </div>


          </div>
        </header>

        {/* Tabs Control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-3xl gap-1">
            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <TabButton active={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')} icon={<TableIcon size={18} />} label="Paisa Tracker" />
            <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={18} />} label="Full Team" />
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardTab 
                cycle={cycle} 
                rounds={rounds} 
                members={members} 
                isAdmin={isAdmin} 
                fetchData={fetchData}
              />
            )}
            {activeTab === 'tracker' && (
              <TrackerTab 
                cycle={cycle} 
                rounds={rounds} 
                members={members} 
                payments={payments}
                isAdmin={isAdmin}
                fetchData={fetchData}
              />
            )}
            {activeTab === 'members' && (
              <MembersTab 
                cycle={cycle} 
                members={members}
                isAdmin={isAdmin}
                fetchData={fetchData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Shell>
  );
}

// Sub-components...
function HeaderStat({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
        <p className="text-xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-sm transition-all ${
        active ? 'bg-white shadow-xl shadow-slate-200 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardTab({ cycle, rounds, members, isAdmin, fetchData }: any) {
  const [drawing, setDrawing] = useState(false);
  const [drawingName, setDrawingName] = useState("");
  const nextRound = rounds.find((r: any) => !r.winnerMemberId);
  const winners = rounds.filter((r: any) => r.winnerMemberId).sort((a: any, b: any) => b.roundNumber - a.roundNumber);

  const onDraw = async () => {
    if (drawing || !nextRound) return;
    setDrawing(true);
    
    const winnersIds = rounds.map((r: any) => r.winnerMemberId).filter((id: any) => !!id);
    const eligibleNames = members.filter((m: any) => !winnersIds.includes(m.id)).map((m: any) => m.name);

    if (eligibleNames.length === 0) {
      alert("No eligible members left!");
      setDrawing(false);
      return;
    }

    const interval = setInterval(() => {
      setDrawingName(eligibleNames[Math.floor(Math.random() * eligibleNames.length)] || "???");
    }, 100);

    try {
      const winner = await kuriService.performDraw(cycle.id, nextRound.id, winnersIds);
      
      setTimeout(() => {
        clearInterval(interval);
        setDrawingName(winner.name);
        setDrawing(false);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#f59e0b']
        });
        setTimeout(fetchData, 2000);
      }, 2500);
    } catch (err: any) {
      clearInterval(interval);
      setDrawing(false);
      alert(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Winners History */}
      <div className="lg:col-span-7 premium-card p-0 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Trophy className="text-yellow-500" size={24} />
            Winners History 🏆
          </h2>
          <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-widest">
            {winners.length} Wins recorded
          </span>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                <th className="px-8 py-4">Round #</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Winner Name</th>
                <th className="px-8 py-4 text-right">Pool Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {winners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                    All winners will appear here after the first draw! 😎
                  </td>
                </tr>
              ) : (
                winners.map((round: any) => (
                  <tr key={round.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <span className="font-black text-slate-400">#{(round.roundNumber || 0).toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-500 text-sm">
                      {new Date(round.roundDate?.toDate?.() || round.roundDate).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm">
                          {members.find(m => m.id === round.winnerMemberId)?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-black text-slate-900">{members.find(m => m.id === round.winnerMemberId)?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-indigo-600">
                      ₹{cycle.grandTotalPool?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Draw Section */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className="premium-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
          {drawing && (
            <div className="absolute inset-0 bg-indigo-600 z-50 flex flex-col items-center justify-center text-white p-10">
               <div className="w-20 h-20 border-8 border-white border-t-transparent rounded-full animate-spin mb-8" />
               <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-4">Shuffling Team Members...</p>
               <h2 className="text-4xl md:text-5xl font-black tracking-tight">{drawingName}</h2>
            </div>
          )}

          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 border border-slate-100 shadow-inner">
             <RefreshCw size={32} className={drawing ? 'animate-spin' : ''} />
          </div>
          
          <h3 className="text-2xl font-black mb-4">Perform Next Draw 🎯</h3>
          
          {nextRound ? (
            <>
              <div className="px-6 py-3 rounded-full bg-slate-50 border border-slate-100 font-black text-slate-500 text-sm mb-10 shadow-sm flex items-center gap-3">
                 <span className="text-indigo-600">Round {nextRound.roundNumber}</span>
                 <div className="w-1 h-1 rounded-full bg-slate-300" />
                 <span>{new Date(nextRound.roundDate?.toDate?.() || nextRound.roundDate).toLocaleDateString()}</span>
              </div>
              
              {isAdmin ? (
                <button 
                  onClick={onDraw}
                  className="btn-primary-gradient w-full py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3"
                >
                  Spin the Wheel! 🎲
                </button>
              ) : (
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 text-amber-700 font-bold text-sm leading-relaxed">
                  ⚠️ Eda, nee admin alla! Admin-u mathrame spin cheyyan pattu. (Only admins can perform the draw).
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
               <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-100">
                  <CheckCircle2 size={32} />
               </div>
               <h4 className="text-xl font-black text-green-600">Cycle Completed! 🏆</h4>
               <p className="text-slate-500 font-medium">All rounds are finished. Great game, team! 🔥</p>
            </div>
          )}
        </div>

        {/* Progress Card */}
        <div className="premium-card p-8 bg-slate-50 border-0 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4 px-2">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Overall Progress</p>
                  <h4 className="text-2xl font-black tracking-tight">Round {winners.length} of {cycle.totalMembers}</h4>
               </div>
               <span className="font-black text-indigo-600 text-xl">{Math.round((winners.length/cycle.totalMembers)*100)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(winners.length/cycle.totalMembers)*100}%` }}
                 className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]" 
               />
            </div>
        </div>
      </div>
    </div>
  );
}

function MembersTab({ cycle, members, isAdmin, fetchData }: any) {
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adding || !email) return;
    setAdding(true);
    try {
      await kuriService.addMemberByEmail(cycle.id, email);
      setEmail("");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Add Member Card */}
        {isAdmin && (
           <div className="flex flex-col gap-4">
              <div className="premium-card p-10 border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center h-full group hover:border-indigo-300 transition-all">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <UserPlus size={28} />
                 </div>
                 <h4 className="text-xl font-black mb-4">Add Team Member 👥</h4>
                 <form onSubmit={addMember} className="w-full space-y-4">
                    <input 
                      type="email" 
                      required
                      placeholder="user@gmail.com"
                      className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3 font-bold text-center text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      disabled={adding}
                      className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {adding ? "Adding..." : "Add Member 🔥"}
                    </button>
                 </form>
              </div>
           </div>
        )}

        {/* Existing Member Cards */}
        {members.map((member: any) => (
          <div key={member.id} className="premium-card p-10 flex flex-col items-center text-center group relative h-full">
             <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 mb-6 flex items-center justify-center font-black text-3xl text-slate-300 group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-inner">
                {member.name?.[0]?.toUpperCase()}
             </div>
             
             <h4 className="text-xl font-black mb-1 group-hover:text-indigo-600 transition-colors truncate w-full px-2">{member.name}</h4>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">@{member.name?.split(' ')?.[0]?.toLowerCase()}</p>

             <div className="flex flex-wrap justify-center gap-2 mb-8">
                {member.isAdmin && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Shield size={10} /> ADMIN
                  </span>
                )}
                {member.upiId && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Smartphone size={10} /> UPI SET
                  </span>
                )}
             </div>

             <div className="w-full pt-6 border-t border-slate-50 mt-auto flex items-center justify-center gap-4">
                {isAdmin && !member.isAdmin && (
                   <button className="p-2 text-slate-300 hover:text-red-500 transition-colors" title="Remove Member">
                      <Trash2 size={18} />
                   </button>
                )}
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/40 hover:text-indigo-600 underline transition-colors">Details</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackerTab({ cycle, rounds, members, payments, isAdmin, fetchData }: any) {
  const { user } = useAuth();
  const [updating, setUpdating] = useState<string | null>(null);

  const getPayment = (roundId: string, memberId: string) => {
    return payments.find((p: any) => p.roundId === roundId && p.memberId === memberId);
  };

  const onToggle = async (roundId: string, memberId: string, currentStatus: boolean) => {
    // Permission check: only admin or the user themselves can toggle
    const currentMemberRecord = members.find((m: any) => m.uid === user?.uid);
    const targetMemberRecord = members.find((m: any) => m.id === memberId);
    
    if (!isAdmin && user?.uid !== targetMemberRecord?.uid) {
       alert("Permission illa! Only admin or you can update this. 😎");
       return;
    }
    
    const key = `${roundId}-${memberId}`;
    setUpdating(key);
    try {
      await kuriService.togglePayment(cycle.id, roundId, memberId, !currentStatus);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="premium-card overflow-hidden animate-up">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-3">
            <TableIcon className="text-indigo-600" size={24} />
            Paisa Tracker 🔥
          </h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">Kuri payments real-time manage cheyyu! 😎</p>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
           <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-green-500 shadow-sm shadow-green-200" /> Paid</div>
           <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-slate-100 border border-slate-200" /> Pending</div>
           <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-amber-400 shadow-sm shadow-amber-200" /> Winner</div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 p-6 border-r border-slate-100 text-left min-w-[200px] shadow-[4px_0_15px_rgba(0,0,0,0.03)]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Team Member 👨‍👩‍👧‍👦</span>
              </th>
              {rounds.map((round: any) => (
                <th key={round.id} className="p-6 bg-white border-r border-slate-50 min-w-[120px] text-center">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Rnd {round.roundNumber}</span>
                  <span className="block font-black text-slate-800 text-sm whitespace-nowrap">
                    {new Date(round.roundDate?.toDate?.() || round.roundDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member: any) => (
              <tr key={member.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 p-6 border-r border-slate-100 font-black text-slate-700 shadow-[4px_0_15px_rgba(0,0,0,0.03)] transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate max-w-[140px] text-base">{member.name}</span>
                    {member.isAdmin && (
                      <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                        <Shield size={10} />
                      </div>
                    )}
                  </div>
                </td>
                {rounds.map((round: any) => {
                  const payment = getPayment(round.id, member.id);
                  const isPaid = payment?.isPaid || false;
                  const isWinner = round.winnerMemberId === member.id;
                  const key = `${round.id}-${member.id}`;
                  const isUpdating = updating === key;

                  return (
                    <td key={round.id} className="p-3 border-r border-slate-50 relative group/cell">
                      {isWinner ? (
                        <div className="w-full h-14 rounded-2xl bg-amber-400 text-white shadow-xl shadow-amber-200/50 ring-2 ring-white ring-inset flex flex-col items-center justify-center">
                           <Star size={18} className="fill-white mb-0.5" />
                           <span className="text-[8px] font-black uppercase">Winner</span>
                        </div>
                      ) : isPaid ? (
                        <button
                          onClick={() => onToggle(round.id, member.id, isPaid)}
                          disabled={isUpdating}
                          className="w-full h-14 rounded-2xl bg-green-500 text-white shadow-xl shadow-green-200/50 ring-2 ring-white ring-inset flex flex-col items-center justify-center transition-all hover:scale-105"
                        >
                          <CheckCircle2 size={18} className="mb-0.5" />
                          <span className="text-[8px] font-black uppercase">Paid</span>
                        </button>
                      ) : (
                        (isAdmin || user?.uid === member.uid) ? (
                          <button
                            onClick={() => onToggle(round.id, member.id, isPaid)}
                            disabled={isUpdating}
                            className="w-full h-10 rounded-full bg-amber-400 text-slate-900 border-none hover:bg-amber-300 transition-all shadow-lg flex items-center justify-center gap-1.5 font-black text-[10px] uppercase tracking-tighter"
                          >
                            {isUpdating ? (
                              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>Pay 🔥</>
                            )}
                          </button>
                        ) : (
                          <div className="w-full h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                             <span className="text-[8px] font-black text-slate-300 uppercase italic">Pending</span>
                          </div>
                        )
                      )}

                    </td>

                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-12">
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Cycle Pool</span>
            <span className="text-3xl font-black text-indigo-600 tracking-tight">₹{cycle.grandTotalPool?.toLocaleString()}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Collection Progress</span>
            <span className="text-3xl font-black text-slate-800 tracking-tight">
               {payments.filter(p => p.isPaid).length} <span className="text-slate-300 font-bold text-lg">/ {members.length * rounds.length}</span>
            </span>
         </div>
         <div className="flex flex-col ml-auto text-right justify-center">
            <p className="text-slate-400 font-bold text-sm italic">Click on cells to toggle payment status! 😎👆</p>
         </div>
      </div>
    </div>
  );
}


