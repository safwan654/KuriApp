"use client"

import Shell from "@/components/layout/Shell";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Database, 
  Loader2, 
  QrCode,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Save,
  Trash2
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendEmailVerification, updatePassword, deleteUser } from "firebase/auth";

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [passForm, setPassForm] = useState({ new: "", confirm: "" });
  
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    upiId: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        phoneNumber: profile.phoneNumber || "",
        upiId: profile.upiId || ""
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...formData,
        updatedAt: new Date()
      });
      await refreshProfile();
      alert("Profile updated machane! 🔥");
    } catch (err) { alert("Error updating profile"); }
    finally { setSaving(false); }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      alert("Verification mail aychitund! Check cheyyu machane! 📧");
    } catch (err: any) { alert(err.message); }
  };

  const handleUpdatePassword = async () => {
    if (!user || passForm.new !== passForm.confirm) return;
    setSaving(true);
    try {
      await updatePassword(user, passForm.new);
      setPassForm({ new: "", confirm: "" });
      alert("Password maatiyitund ketto! 😎");
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    if (!user || !confirm("Eda mone... Account full delete cheyyano? Ellam povum ketto! 🛑")) return;
    try {
      await deleteUser(user);
      window.location.href = "/";
    } catch (err: any) { alert(err.message); }
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 space-y-2 flex lg:block overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 custom-scrollbar-hide gap-2">
            <h2 className="hidden lg:block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 px-4">Account Settings</h2>
            {[
              { id: 'profile', label: 'Profile & UPI', icon: User },
              { id: 'email', label: 'Email Verification', icon: Mail },
              { id: 'security', label: 'Security Settings', icon: Lock },
              { id: 'data', label: 'Personal Data', icon: Database },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-none lg:w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' 
                  : 'text-slate-400 hover:text-slate-600 bg-slate-50 lg:bg-transparent'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-300'} />
                {tab.label}
              </button>
            ))}
          </div>


          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-14 border border-slate-50 animate-up min-h-[600px] flex flex-col">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-100">
                       {profile?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                       <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                          {profile?.displayName || 'Safwan'} <span className="text-xl">😎</span>
                       </h1>
                       <p className="text-slate-400 font-bold">{user?.email}</p>
                    </div>
                 </div>
                 <div className="badge bg-amber-500 text-white rounded-full px-6 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                    <ShieldCheck size={14} /> Premium User
                 </div>
              </div>

              <div className="flex-1">
                {activeTab === 'profile' && (
                  <div className="space-y-10 animate-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-sm font-black text-slate-800 ml-1">Full Name</label>
                          <input className="premium-input-field" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-sm font-black text-slate-800 ml-1">Phone Number</label>
                          <input className="premium-input-field" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                       </div>
                    </div>

                    <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-[32px] p-10">
                       <div className="flex items-center gap-3 mb-6">
                          <QrCode className="text-amber-500" size={24} />
                          <h3 className="text-lg font-black text-slate-800 uppercase">UPI ID (Payable ID)</h3>
                       </div>
                       <input placeholder="eg: sdsfadc@upi" className="premium-input-field bg-white border-amber-100 focus:border-amber-500" value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} />
                       <p className="mt-6 text-slate-400 font-bold text-xs leading-relaxed">Traditional Kuri round drawing kittumbol matte members-nu ninte UPI id auto kittyum machane! 🔥</p>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-slate-50">
                      <button onClick={handleSaveProfile} disabled={saving} className="btn-save-profile">
                        {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes 🔥</>}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div className="space-y-8 animate-up">
                    <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                       <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${user?.emailVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                             {user?.emailVerified ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                          </div>
                          <div>
                             <h3 className="text-xl font-black">{user?.emailVerified ? 'Verification Complete! ✅' : 'Haa... Verify aakan baki und! 👀'}</h3>
                             <p className="text-slate-400 font-bold">{user?.email}</p>
                          </div>
                       </div>
                       {!user?.emailVerified && (
                          <button onClick={handleSendVerification} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase hover:bg-slate-800 shadow-xl">Send Mail 📧</button>
                       )}
                    </div>
                    <div className="p-8 border-2 border-indigo-50 rounded-[32px] bg-indigo-50/20 text-indigo-600 font-bold text-sm leading-relaxed">
                       💡 Account security-nu vendi email verify cheyyunnath nallathanu machane! Appol ninnakku extra features set aakam! 🔥
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-10 animate-up max-w-xl mx-auto bg-slate-50/50 p-10 rounded-[40px] border border-slate-100">
                    <h3 className="text-3xl font-black text-center mb-8 flex items-center justify-center gap-3">Change Password <Lock size={24} className="text-indigo-600" /></h3>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">New Password</label>
                          <input type="password" className="premium-input-field" value={passForm.new} onChange={e=>setPassForm({...passForm, new: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Confirm Password</label>
                          <input type="password" className="premium-input-field" value={passForm.confirm} onChange={e=>setPassForm({...passForm, confirm: e.target.value})} />
                       </div>

                    </div>
                    <button onClick={handleUpdatePassword} disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg uppercase shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                       {saving ? <Loader2 className="animate-spin" /> : 'Update Password 🔥'}
                    </button>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-10 animate-up">
                    <div className="bg-red-50 p-10 rounded-[32px] border border-red-100">
                       <div className="flex items-center gap-4 mb-6">
                          <ShieldAlert className="text-red-500" size={32} />
                          <h3 className="text-2xl font-black text-red-600">Danger Zone! 🛑</h3>
                       </div>
                       <p className="text-red-800/60 font-bold mb-8 leading-relaxed text-sm">
                          Account delete cheythu kazhinjal ninte ellam data-yum permanent aayi delete aakum. Groups, kuri histories, contributions... pinne onnum thirich kittilla ketto machane!
                       </p>
                       <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase flex items-center gap-2 hover:bg-red-700 shadow-xl shadow-red-200">
                          <Trash2 size={18} /> Full Clean (Delete Account) 🛑
                       </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        .premium-input-field {
          width: 100%;
          background: #fff;
          border: 2px solid #f1f5f9;
          border-radius: 20px;
          padding: 16px 24px;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.2s ease;
          outline: none;
        }
        .premium-input-field:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.05);
        }
        .btn-save-profile {
          background: #0f172a;
          color: #fff;
          padding: 20px 48px;
          border-radius: 24px;
          font-weight: 900;
          text-transform: uppercase;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-save-profile:hover {
          background: #1e293b;
          transform: translateY(-2px);
        }
      `}</style>
    </Shell>
  );
}
