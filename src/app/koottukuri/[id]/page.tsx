"use client"

import Shell from "@/components/layout/Shell";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { groupService } from "@/lib/services/groupService";
import { Group, GroupMember, Event } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, 
  ChevronRight, 
  Plus, 
  Share2, 
  Shield, 
  Table as TableIcon,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Copy,
  Heart,
  TrendingUp,
  Trash2,
  QrCode,
  Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GroupDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user, profile } = useAuth();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchData = async () => {
    try {
      const g = await groupService.getGroupDetails(id);
      if (!g) {
        router.push("/koottukuri");
        return;
      }
      setGroup(g);
      
      const [m, e] = await Promise.all([
        groupService.getGroupMembers(id),
        groupService.getGroupEvents(id)
      ]);
      
      setMembers(m);
      setEvents(e);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading || !group) return (
    <Shell>
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </Shell>
  );

  const currentMember = members.find(m => m.uid === user?.uid);
  const isAdmin = currentMember?.role === 'admin';

  return (
    <Shell>
      <div className="relative bg-slate-900 rounded-[40px] p-8 md:p-12 mb-12 overflow-hidden shadow-2xl shadow-purple-200">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 blur-[100px] -z-0 rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/10 blur-[80px] -z-0 rounded-full" />
        <div className="relative z-1">
          <nav className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-10 overflow-x-auto whitespace-nowrap">
            <Link href="/koottukuri" className="hover:text-white transition-colors">Nammade Groups😎</Link>
            <ChevronRight size={14} />
            <span className="text-white">{group.name}</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="animate-up">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                {group.name} <span className="text-purple-400">🔥</span>
              </h1>
              <div className="flex flex-wrap gap-6 items-center text-slate-400 font-black text-sm uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-purple-500" />
                  <span>Kuri: <strong className="text-white">₹{group.contributionAmount?.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-indigo-400" />
                  <span className="text-white">{members.length} Team Members 👨‍👩‍👧‍👦</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                  <Shield size={14} className="text-purple-400" />
                  <span>Role: <strong className="text-purple-400">{currentMember?.role || 'Guest'}</strong></span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 animate-up delay-100">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.host}/join/${group.inviteCode}`);
                  alert("Link copied bruhh! Go share it! 🔥🔗");
                }}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-xl"
              >
                <Share2 size={18} /> Copy Link 🔗
              </button>
              {isAdmin && (
                <>
                  <button onClick={() => setActiveTab('dashboard')} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/20">
                    <Plus size={18} /> Event 🔥
                  </button>
                  <Link href={`/koottukuri/${id}/edit`} className="bg-white/10 text-white border border-white/10 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center">
                    Edit 📝
                  </Link>
                  <button 
                    onClick={async () => {
                       if (confirm("Are you sure? Ithu full delete aakum ketto! 🛑")) {
                          await groupService.deleteGroup(id);
                          router.push("/koottukuri");
                       }
                    }}
                    className="bg-red-500/80 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
                  >
                    Delete 🛑
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-12 animate-up delay-200 px-4">
        <div className="bg-white p-2 rounded-3xl shadow-xl flex gap-1 border border-slate-100 overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard 😎' },
            { id: 'tracker', icon: TableIcon, label: 'Paisa Tracker 🔥' },
            { id: 'team', icon: Users, label: 'Full Team 👨‍👩‍👧‍👦' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <DashboardTab group={group} events={events} isAdmin={isAdmin} id={id} members={members} setActiveTab={setActiveTab} />}
          {activeTab === 'tracker' && <TrackerTab group={group} events={events} members={members} fetchData={fetchData} isAdmin={isAdmin} id={id} />}
          {activeTab === 'team' && <TeamTab members={members} isAdmin={isAdmin} id={id} />}
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

function DashboardTab({ group, events, isAdmin, id, members, setActiveTab }: any) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const onAddEvent = async () => {
     if (!newTitle || !newDate) return;
     try {
        await groupService.addEvent(id, {
           title: newTitle,
           date: newDate,
           status: 'Upcoming',
           hostName: 'Admin'
        });
        window.location.reload();
     } catch (e) { alert(e); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-up">
      <div className="lg:col-span-2 space-y-10">
        <div className="premium-card overflow-hidden">
          <div className="p-10 bg-white border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-black flex items-center gap-3">Upcoming Functions 🎉</h2>
            {isAdmin && (
              <button 
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="btn-primary-gradient px-8 py-3 rounded-full text-xs font-black shadow-lg shadow-purple-100 ring-4 ring-white"
              >
                {showAddEvent ? 'Cancel 🛑' : '+ Puthiya Event 🔥'}
              </button>
            )}
          </div>
          {showAddEvent && (
             <div className="p-10 bg-slate-50 border-b border-slate-100 animate-down">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Event Name 👀</label>
                      <input className="w-full p-4 rounded-xl border-0 font-bold outline-none ring-2 ring-slate-100 focus:ring-purple-600 transition-all bg-white" placeholder="eg: Marriage Reception" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Event Date 📅</label>
                      <input type="date" className="w-full p-4 rounded-xl border-0 font-bold outline-none ring-2 ring-slate-100 focus:ring-purple-600 transition-all bg-white" value={newDate} onChange={e=>setNewDate(e.target.value)} />
                   </div>
                   <div className="flex items-end">
                      <button onClick={onAddEvent} className="w-full py-4 rounded-xl bg-slate-900 text-white font-black hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 uppercase tracking-widest text-[10px]">Sathiye... Save Cheyyu! 🔥</button>
                   </div>
                </div>
             </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50">
                    <th className="p-8 text-[12px] font-black text-slate-800">Event Title</th>
                    <th className="p-8 text-[12px] font-black text-slate-800 text-center">Host 😎</th>
                    <th className="p-8 text-[12px] font-black text-slate-800 text-center">Collection Progress</th>
                    <th className="p-8 text-[12px] font-black text-slate-800 text-center">Status</th>
                    <th className="p-8 text-[12px] font-black text-slate-800 text-end">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.length === 0 ? (
                  <tr><td colSpan={5} className="p-32 text-center text-slate-400 font-bold italic bg-white/50">Ivide onnum illa... Adminodu para set aakan! 😅</td></tr>
                ) : (
                  events.map((event: any) => {
                    const paidCount = Object.values(event.payments || {}).filter((p: any) => p.status === 'Verified').length;
                    const totalNeeded = members.length;
                    const progress = totalNeeded > 0 ? (paidCount / totalNeeded) * 100 : 0;
                    return (
                      <tr key={event.id} className="group hover:bg-slate-50/70 transition-all bg-white">
                        <td className="p-8">
                          <div className="flex flex-col">
                            <span className="text-base font-black text-slate-800 leading-tight">{event.title}</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{event.date} (Cycle 1)</span>
                          </div>
                        </td>
                        <td className="p-8 text-center">
                           <span className="inline-block rounded-full bg-indigo-50 text-indigo-600 font-black px-5 py-1.5 border border-indigo-100 text-[10px]">{event.hostName || "Admin"}</span>
                        </td>
                        <td className="p-8">
                           <div className="max-w-[140px] mx-auto flex items-center gap-3">
                             <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-indigo-600 transition-all shadow-[0_0_10px_rgba(79,70,229,0.4)]" style={{ width: `${progress}%` }} />
                             </div>
                             <span className="text-[10px] font-black text-slate-400">{paidCount}/{totalNeeded}</span>
                           </div>
                        </td>
                        <td className="p-8 text-center">
                           <span className={`inline-block rounded-full font-black px-4 py-1.5 border text-[10px] uppercase tracking-tighter ${
                              event.status === 'PaymentOpen' ? 'bg-green-50 text-green-600 border-green-100' : 
                              event.status === 'Closed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                           }`}>
                              {event.status === 'PaymentOpen' ? 'On Mode 🔥' : event.status === 'Closed' ? 'Settled ✅' : 'Upcoming 👀'}
                           </span>
                        </td>
                        <td className="p-8 text-end">
                           <div className="flex items-center justify-end gap-3 translate-x-2">
                              {isAdmin && (
                                <>
                                  <Link href={`/koottukuri/${id}/event/${event.id}/edit`} className="p-2.5 rounded-full bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-all border border-indigo-100">
                                     <Pencil size={14} /> 
                                  </Link>
                                  <button onClick={async () => { if (confirm("Delete this function? 🛑")) { await groupService.deleteEvent(id, event.id); window.location.reload(); } }} className="p-2.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all">
                                     <Trash2 size={14} />
                                  </button>
                                  <div className="w-px h-6 bg-slate-100" />
                                  {event.status === 'PaymentOpen' ? (
                                     <button onClick={async () => { await groupService.updateEvent(id, event.id, { status: 'Closed' }); window.location.reload(); }} className="bg-white border border-red-500 text-red-500 rounded-full px-5 py-2 font-black text-[10px] uppercase flex items-center gap-2 hover:bg-red-50">Close 🔴</button>
                                  ) : event.status === 'Upcoming' && (
                                     <button onClick={async () => { await groupService.updateEvent(id, event.id, { status: 'PaymentOpen' }); window.location.reload(); }} className="bg-white border border-green-600 text-green-600 rounded-full px-5 py-2 font-black text-[10px] uppercase flex items-center gap-2 hover:bg-green-50">Go Live 🔥</button>
                                  )}
                                </>
                              )}
                              {!isAdmin && event.status === 'PaymentOpen' && (
                                 <button onClick={() => setActiveTab('tracker')} className="rounded-full bg-white border border-green-600 text-green-600 px-5 py-1.5 font-black text-[10px] uppercase hover:bg-green-50">Pay On 🔥</button>
                              )}
                           </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
         <div className="premium-card p-10 flex flex-col items-center text-center h-full min-h-[400px]">
            <h3 className="text-2xl font-black mb-8">Sett aakan baki und 👀</h3>
            <div className="flex-1 w-full flex flex-col items-center justify-center">
               {(() => {
                  const activeEvent = events.find((e: any) => e.status === 'PaymentOpen');
                  if (!activeEvent) return (
                    <div className="animate-up">
                       <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-8 border border-slate-100"><CheckCircle2 size={48} /></div>
                       <h4 className="text-2xl font-black text-slate-800 mb-2">Live event illa 😎</h4>
                       <p className="text-slate-400 font-bold text-sm tracking-tight">Active event thudangumbo list ivide varum!</p>
                    </div>
                  );

                  const pending = members.filter((m: any) => {
                     const p = activeEvent.payments?.[m.id];
                     return m.name !== activeEvent.hostName && (!p || p.status !== 'Verified');
                  });

                  if (pending.length === 0) return (
                    <div className="animate-up">
                       <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-8 border border-green-100 shadow-xl shadow-green-100/50"><CheckCircle2 size={48} /></div>
                       <h4 className="text-2xl font-black text-slate-800 mb-2">Ippo pending illa 😎</h4>
                       <p className="text-slate-400 font-bold text-sm">Aduthath thudangumbo parayaam!</p>
                    </div>
                  );

                  return (
                    <div className="w-full animate-up">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">{pending.length} Perude baki und 🔥</p>
                       <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {pending.map((m: any) => (
                             <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-black">{m.name[0]}</div>
                                   <span className="font-black text-sm text-slate-700">{m.name}</span>
                                </div>
                                <span className="text-[10px] bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-400 font-black uppercase">Pending</span>
                             </div>
                          ))}
                       </div>
                       <button onClick={() => setActiveTab('tracker')} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100">Check Tracker 🔥</button>
                    </div>
                  );
               })()}
            </div>
         </div>
      </div>

    </div>
  );
}

function TrackerTab({ group, events, members, fetchData, isAdmin }: any) {
  const { user } = useAuth();
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [payingMemberId, setPayingMemberId] = useState<string | null>(null);
  const [payingEventId, setPayingEventId] = useState<string | null>(null);

  const onSelectPayment = (memberId: string, eventId: string) => {
     const event = events.find((e: any) => e.id === eventId);
     const host = members.find(m => m.name === event?.hostName) || members[0];
     setSelectedHost(host);
     setPayingMemberId(memberId);
     setPayingEventId(eventId);
  }

  const onConfirmPaid = async () => {
     if (!payingEventId || !selectedHost || !payingMemberId) return;
     try {
        await groupService.markPayment(group.id, payingEventId, payingMemberId, 'Paid');
        await fetchData();
        setSelectedHost(null);
        setPayingMemberId(null);
        setPayingEventId(null);
     } catch (e) { alert(e); }
  }

  const onToggleVerified = async (eventId: string, memberId: string, current: string) => {
     try {
        const nextStatus = current === 'Verified' ? 'Pending' : 'Verified';
        await groupService.markPayment(group.id, eventId, memberId, nextStatus);
        await fetchData();
     } catch (e) { alert(e); }
  }

  return (
    <div className="animate-up relative">
      <div className="premium-card p-0 overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-50">
           <h3 className="text-xl font-black">Full Cycle Paisa Tracker 😎 🔥</h3>
           <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">History including all previous events</p>
        </div>
        <div className="overflow-x-auto custom-scrollbar custom-scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
               <tr className="bg-slate-50/50 uppercase text-[10px] font-black text-slate-400 tracking-[0.2em]">
                  <th className="p-8 border-r border-slate-50 sticky left-0 bg-white z-10 w-64 text-center sticky-column-shadow">Member Name 👨‍👩‍👧‍👦</th>
                  {events.map((event: any) => (
                    <th key={event.id} className="p-8 text-center border-r border-slate-50 min-w-[200px]">
                       <span className={`block mb-1 ${event.status === 'Closed' ? 'text-slate-400' : 'text-indigo-600'}`}>
                          {event.title?.toUpperCase()}
                       </span>
                       <span className="block text-[8px] opacity-60">{event.date}</span>
                    </th>
                  ))}
                  <th className="p-8 text-center bg-[#52a17f] text-white w-48">Total Given 💰</th>
                  <th className="p-8 text-center bg-[#4fb19d] text-white w-48">Total Got 🏆</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {members.map((member: any) => {
                  let totalContributed = 0;
                  let totalReceived = 0;
                  
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-all font-black">
                       <td className="p-6 border-r border-slate-50 sticky left-0 bg-white z-10 text-center sticky-column-shadow">
                          <div className="flex items-center gap-4 justify-center">
                             <div className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center text-white text-sm uppercase">{member.name[0]}</div>
                             <span className="text-slate-800 text-sm whitespace-nowrap">{member.name}</span>
                          </div>
                       </td>
                       
                       {events.map((event: any) => {
                          const payment = event.payments?.[member.id] || { status: 'Pending' };
                          const isHost = event.hostName === member.name;
                          
                          // Standard member contribution
                          if (!isHost && payment.status === 'Verified') {
                             totalContributed += group.contributionAmount;
                          }
                          
                          // Calculate total received if host
                          if (isHost) {
                             const verifiedPaymentsCount = Object.values(event.payments || {}).filter((p: any) => p.status === 'Verified').length;
                             totalReceived += (verifiedPaymentsCount * group.contributionAmount);
                          }

                          return (
                            <td key={event.id} className="p-6 text-center border-r border-slate-50 bg-slate-50/20">
                               {isHost ? (
                                 <span className="text-[10px] text-slate-400 uppercase font-black italic">[Host-nu kitto 🏆]</span>
                               ) : (
                                  <div className="flex flex-col items-center gap-2">
                                     {payment.status === 'Verified' ? (
                                        <div className="flex flex-col items-center gap-1">
                                           <span className="text-green-600 text-[11px] font-black">Verified ✅</span>
                                           {isAdmin && <button onClick={() => onToggleVerified(event.id, member.id, 'Verified')} className="text-[8px] text-red-400 hover:text-red-500 underline decoration-dotted">Undo</button>}
                                        </div>
                                     ) : payment.status === 'Paid' ? (
                                        <div className="flex flex-col items-center">
                                           <span className="text-amber-500 animate-pulse text-[11px]">Pending Verify...</span>
                                           {isAdmin && <button onClick={() => onToggleVerified(event.id, member.id, 'Paid')} className="bg-green-600 text-white px-4 py-1.5 rounded-full text-[10px] mt-1 shadow-md hover:bg-green-700 uppercase">Verify 🔥</button>}
                                        </div>
                                     ) : (
                                        event.status === 'PaymentOpen' && member.uid === user?.uid ? (
                                          <button onClick={() => onSelectPayment(member.id, event.id)} className="bg-amber-400 text-slate-900 px-5 py-2 rounded-full text-[10px] uppercase shadow-lg shadow-amber-200 hover:scale-105">Pay 🔥</button>
                                        ) : (
                                          <span className="text-[10px] text-slate-300 uppercase italic">Pending</span>
                                        )
                                     )}
                                  </div>
                               )}
                            </td>
                          );
                       })}

                       <td className="p-6 text-center text-2xl text-green-700 bg-green-50/30 font-display italic">₹{totalContributed.toLocaleString()}</td>
                       <td className="p-6 text-center text-2xl text-indigo-500 bg-indigo-50/30 font-display italic">₹{totalReceived.toLocaleString()}</td>
                    </tr>
                  )
               })}
            </tbody>
            <tfoot className="bg-[#1e90ff] text-white">
               <tr>
                  <td className="p-6 font-black text-xl italic sticky left-0 bg-[#007bff] z-10 border-r border-white/10 uppercase tracking-tighter sticky-column-shadow">Cycle Grand Total 💰</td>
                  {events.map((event: any) => {
                    const verifiedCount = Object.values(event.payments || {}).filter((p: any) => p.status === 'Verified').length;
                    return (
                      <td key={event.id} className="p-5 text-center text-lg font-black font-display italic border-r border-white/10">
                        ₹{(verifiedCount * group.contributionAmount).toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="p-5 text-center text-2xl font-black font-display italic bg-[#f7e01d] text-slate-900 border-l border-white/10 border-r border-white/10">₹{(events.reduce((acc: number, event: any) => acc + (Object.values(event.payments || {}).filter((p: any) => p.status === 'Verified').length * group.contributionAmount), 0)).toLocaleString()}</td>
                  <td className="p-5 text-center text-2xl font-black font-display italic bg-[#a855f7] border-l border-white/10">₹{(events.reduce((acc: number, event: any) => acc + (Object.values(event.payments || {}).filter((p: any) => p.status === 'Verified').length * group.contributionAmount), 0)).toLocaleString()}</td>
               </tr>
            </tfoot>

          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedHost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedHost(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500"><QrCode size={40} /></div>
                <h4 className="text-2xl font-black mb-2">Pay to {selectedHost.name} 😎</h4>
                <p className="text-slate-400 font-bold text-sm mb-8">Scan QR or Copy UPI ID to pay via {group.name}</p>
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 mb-8 flex items-center justify-between gap-4">
                   <span className="font-black text-indigo-600 break-all">{selectedHost.upiId || 'host@upi'}</span>
                   <button onClick={() => { navigator.clipboard.writeText(selectedHost.upiId || 'host@upi'); alert('Copied!'); }} className="p-3 bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-colors"><Copy size={16} /></button>
                </div>
                <button onClick={onConfirmPaid} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg uppercase shadow-2xl hover:bg-green-600 transition-all">Marked as Paid ✅</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeamTab({ members, isAdmin, id }: any) {
  const [email, setEmail] = useState("");
  const onAddMember = async () => { if (!email) return; try { await groupService.addMemberByEmail(id, email); window.location.reload(); } catch (e) { alert(e); } }
  
  const onPromote = async (memberId: string) => {
     if (!confirm("Are you sure? Ivare admin aakkanamo? 😎")) return;
     try { await groupService.updateMemberRole(memberId, 'admin'); window.location.reload(); } catch (e) { alert(e); }
  }

  const onRemove = async (memberId: string) => {
     if (!confirm("Edaa.. Ivare team-innu purathakkno? 🛑")) return;
     try { await groupService.removeMember(memberId); window.location.reload(); } catch (e) { alert(e); }
  }

  return (
    <div className="space-y-12 animate-up">
      {isAdmin && (
        <div className="premium-card p-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><Users size={24} /></div>
              <div><h3 className="text-xl font-black">Team-ine kettu bruhh! 😎</h3><p className="text-[10px] font-black uppercase text-slate-400">Puthia members-ne ivide add cheyyu.</p></div>
           </div>
           <div className="flex-1 w-full max-w-md flex gap-2">
              <input className="flex-1 p-4 rounded-xl border-0 font-bold bg-slate-50 outline-none ring-2 ring-transparent focus:ring-indigo-600 transition-all shadow-inner" placeholder="User-re Email adikk..." value={email} onChange={e => setEmail(e.target.value)} />
              <button onClick={onAddMember} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase hover:bg-indigo-600 transition-all">Add Member 🔥</button>
           </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member: any) => (
          <div key={member.id} className="premium-card p-0 group flex flex-col animate-up">
             <div className="p-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-[40px] bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] p-0.5 mb-6 group-hover:rotate-6 transition-transform shadow-xl">
                   <div className="w-full h-full rounded-[38px] bg-white flex items-center justify-center text-slate-300 font-black text-4xl shadow-inner">{member.name[0]}</div>
                </div>
                <h4 className="text-2xl font-black mb-1">{member.name}</h4>
                <div className="badge bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full px-8 py-1.5 font-black text-[11px] mb-8">{member.role === 'admin' ? 'Admin 😎' : 'Member'}</div>
                <div className="w-full py-2.5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center gap-2 text-indigo-600 font-bold text-xs mb-10 shadow-inner group-hover:bg-indigo-50 transition-colors"><QrCode size={14} className="opacity-40" />{member.upiId || 'sdsfadc@upi'}</div>
                
                {isAdmin && member.role === 'member' && (
                  <div className="flex w-full gap-2 mb-8">
                    <button onClick={() => onPromote(member.id)} className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">Promote 👑</button>
                    <button onClick={() => onRemove(member.id)} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all">Remove 🛑</button>
                  </div>
                )}

                <div className="w-full space-y-4 font-bold opacity-60">
                   <div className="flex items-center justify-between text-sm border-b border-slate-50 pb-3"><span className="text-slate-500">Koduthath:</span><span className="text-green-600 text-xs">₹0</span></div>
                   <div className="flex items-center justify-between text-sm border-b border-slate-50 pb-3"><span className="text-orange-500">Baki und:</span><span className="text-orange-500 text-xs">₹0</span></div>
                   <div className="flex items-center justify-between text-sm grow"><span className="text-slate-500">Kittiyath:</span><span className="text-indigo-600 text-xs">₹0</span></div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

