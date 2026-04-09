"use client"

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2, Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Email or Password sariyaayilla bruhh... onnudi nokku! 😅");
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Google login failed bruhh... try again later!");
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
             <h2 className="text-3xl font-black mb-2 tracking-tight uppercase">Adichu Keri Vaa! 😎</h2>
             <p className="font-bold opacity-80 text-sm">Nammade KuriHub-ilekku swagatham Bruhh! 🔥</p>
          </div>

          <div className="p-10 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-black border border-red-100 flex items-center gap-2">
                   <span>⚠️ {error}</span>
                </div>
              )}

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Email ID Para 👀</label>
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

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Password Entha? 🔑</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-14 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 pt-2">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Oorth Vekkano</span>
                 </label>
                 <Link href="#" className="text-xs font-black text-indigo-600 hover:underline">Marannu poyo? 😅</Link>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary-gradient w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-200"
                >
                  {loading ? <Loader2 className="animate-spin" /> : null}
                  Keru Bruhh! 🔥
                </button>

                <div className="relative py-2">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                   <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-400">Or Login Through</span></div>
                </div>

                <button 
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-black text-slate-700 shadow-sm"
                >
                  <Globe size={20} className="text-indigo-600" />
                  Google vellu Keraam 😎
                </button>

              </div>
            </form>


            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 font-bold text-sm">
                Account ille? 
                <Link href="/register" className="text-indigo-600 font-black ml-2 hover:underline">Puthiya account undakkiyaalo? 😎</Link>
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
