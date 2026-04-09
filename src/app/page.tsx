"use client"

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Link as LinkIcon, Table as TableIcon, QrCode, ArrowRight } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="flex-1 bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex flex-col items-center text-center px-6 overflow-hidden" 
               style={{ background: 'radial-gradient(circle at top right, #fdf4ff, #faf5ff, #ffffff)' }}>
        
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/50 blur-[100px] -z-10 rounded-full animate-pulse-subtle" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-black border border-indigo-100 mb-8 animate-glow">
            Puthiya Update: Multi-Group Set Aayi! 😎
          </span>
          
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight text-slate-900 tracking-tight">
            Kuri tracking ippo full simple aanu Bruhh...<span className="text-indigo-600">cash undallo lle...! 🔥</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Marriage, house warming, party... enthum aayikote. KuriHub undenkil contribution matrix full set aakam. QR scan cheyyu, settle cheyyu, mass aaku! 😎
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            <Link 
              href="/login"
              className="btn-primary-gradient px-10 py-5 rounded-full flex items-center justify-center gap-3 font-black text-xl shadow-2xl shadow-indigo-200"
            >
              Ippo Thanne Thudangam 🔥
            </Link>
            <a href="#features" className="px-10 py-5 rounded-full border border-slate-900 bg-white text-slate-900 font-black hover:bg-slate-50 transition-all text-xl">
              Enthokke und nokkam 👀
            </a>
          </div>


          {/* Mockup Window */}
          <div className="relative mx-auto mt-10 p-1 bg-slate-200/20 rounded-3xl border border-slate-100 shadow-2xl max-w-5xl group overflow-hidden">
             <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2 rounded-t-[22px]">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-400">
                   kurihub.next.app
                </div>
             </div>
             
             <div className="bg-slate-50 p-6 md:p-12 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                   <div className="md:col-span-4">
                      <div className="premium-card p-6 text-left shadow-lg scale-95 group-hover:scale-100 transition-transform duration-500">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">K</div>
                            <h4 className="font-black text-slate-800">Sajeesh&apos;s Kuri</h4>
                         </div>
                         <div className="mb-6">
                            <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Total Collection</p>
                            <h2 className="text-3xl font-black text-green-600">₹1,50,000</h2>
                         </div>
                         <div className="pt-4 border-t border-slate-50 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-400"><span>Members</span><span className="text-slate-800">15</span></div>
                            <div className="flex justify-between text-xs font-bold text-slate-400"><span>Status</span><span className="text-green-600">Active</span></div>
                         </div>
                      </div>
                   </div>
                   <div className="md:col-span-8 flex flex-col gap-6">
                      <div className="premium-card p-6 text-left shadow-lg">
                         <h4 className="font-black text-slate-800 mb-4">Recent Tracker Update 🔥</h4>
                         <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                               <div className="h-full bg-indigo-600 w-3/4" />
                            </div>
                            <span className="font-black text-indigo-600 text-sm">75% Paid</span>
                         </div>
                      </div>
                      <div className="premium-card p-6 text-left shadow-lg">
                         <h4 className="font-black text-slate-800 mb-4">Top Contributors 😎</h4>
                         <div className="space-y-4">
                            {[
                               { n: 'Appu', a: '10,000', s: 'Paid' },
                               { n: 'Bro', a: '5,000', s: 'Paid' },
                            ].map((p, i) => (
                               <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-2">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-slate-100 text-[10px] font-black flex items-center justify-center">{p.n[0]}</div>
                                     <span className="font-bold text-sm">{p.n}</span>
                                  </div>
                                  <span className="text-green-600 font-bold text-sm">₹{p.a}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-4">Full Scene Features! 🔥</h2>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-widest italic">Nammade teaminu vendi undakkiyath.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem 
              icon={<LinkIcon className="text-red-500" size={32} />}
              title="Invite Links 😎"
              desc="Link share cheyyu, teamine kettu. Admin approve cheythaal scene set!"
              bg="bg-red-50"
            />
            <FeatureItem 
              icon={<TableIcon className="text-green-500" size={32} />}
              title="Matrix Tracker 🔥"
              desc="Aaru koduthu, aaru baki vechu... ellam kure baki illathe nokkam."
              bg="bg-green-50"
            />
            <FeatureItem 
              icon={<QrCode className="text-indigo-500" size={32} />}
              title="QR Payments 💰"
              desc="UPI QR scan cheyyu, ippo thanne settle aaku machane."
              bg="bg-indigo-50"
            />
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-slate-400 font-bold text-sm border-t border-slate-50">
        © 2026 KuriHub Team. Made with ❤️ in Kerala.
      </footer>
    </main>
  );
}

function FeatureItem({ icon, title, desc, bg }: { icon: any, title: string, desc: string, bg: string }) {
  return (
    <div className={`p-10 rounded-[40px] ${bg} hover:shadow-2xl transition-all duration-500 group`}>
      <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
