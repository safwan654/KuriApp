"use client"

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password mismatch! Onnudi nokku bruhh... 😅");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName });

      // Create user doc in firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Account undakkan pattunnilla... something wrong! 🛑");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6" 
         style={{ background: 'radial-gradient(circle at top right, #fdf4ff, #faf5ff, #ffffff)' }}>
      
      <Link href="/" className="fixed top-10 left-10 flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors group">
         <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
         Thirike Pokaam
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="premium-card overflow-hidden border-0 shadow-2xl">
          <div className="btn-primary-gradient py-10 text-center text-white border-0">
             <h2 className="text-3xl font-black mb-2 tracking-tight uppercase">Account Undakkam! 😎</h2>
             <p className="font-bold opacity-80 text-sm">Nammude teamil keri vaa Bruhh! 🔥</p>
          </div>

          <div className="p-10 bg-white">
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-black border border-red-100 flex items-center gap-2">
                   <span>⚠️ {error}</span>
                </div>
              )}

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Ninte Perru Para 👀</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name eg: Safwan"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Ninte Email adikk 👀</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Password 🔑</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-6 pr-10 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Onnudi para (Confirm)</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-6 pr-10 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary-gradient w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-200"
                >
                  {loading ? <Loader2 className="animate-spin" /> : null}
                  Account Undaakkaam! 🔥
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 font-bold text-sm">
                Alreaday account undo? 
                <Link href="/login" className="text-indigo-600 font-black ml-2 hover:underline">Login Cheyyu Bruhh 😎</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <footer className="mt-12 text-slate-400 font-bold text-xs">
        © 2026 KuriHub Malabar Edition 🔥
      </footer>
    </div>
  );
}
