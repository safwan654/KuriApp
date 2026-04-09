"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { kuriService } from "@/lib/services/kuriService";
import { groupService } from "@/lib/services/groupService";
import { motion } from "framer-motion";
import { Loader2, Users, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function JoinByCodePage() {
  const { code } = useParams() as { code: string };
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<'checking' | 'error' | 'success'>('checking');
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!user || !profile) {
      // Redirect to login with returnUrl
      router.push(`/login?returnUrl=/join/${code}`);
      return;
    }

    try {
      // 1. Try Traditional Kuri
      let result = await kuriService.joinByCode(code, user.uid, profile.displayName);
      
      // 2. If not found, try Koottukuri
      if (!result) {
        result = await groupService.joinByCode(code, user.uid, profile.displayName);
      }

      if (result) {
        setStatus('success');
        setTimeout(() => {
          if (result.type === 'traditional') {
            router.push(`/traditional/${result.id}`);
          } else {
            router.push(`/koottukuri/${result.id}`);
          }
        }, 2000);
      } else {
        setStatus('error');
        setError("Ithu valid invite link alla machane! Code onnudi nokku. 😅");
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || "Something went wrong while joining... 🛑");
    }
  };

  useEffect(() => {
    if (!authLoading) {
      handleJoin();
    }
  }, [code, user, profile, authLoading]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center"
         style={{ background: 'radial-gradient(circle at top right, #fdf4ff, #faf5ff, #ffffff)' }}>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {status === 'checking' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
               <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800">Checking Invite Code...</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Oru nimisham... verify cheyyuvaanu! 😎</p>
          </div>
        )}

        {status === 'error' && (
          <div className="premium-card p-10 space-y-8 bg-white shadow-2xl">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
               <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-800">Scene Aayi! 🛑</h1>
            <p className="text-slate-500 font-medium leading-relaxed">{error}</p>
            <Link href="/dashboard" className="btn-primary-gradient w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2">
              Back to Dashboard 😎
            </Link>
          </div>
        )}

        {status === 'success' && (
          <div className="premium-card p-10 space-y-8 bg-white shadow-2xl border-green-100">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 animate-bounce">
               <Sparkles size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Keri Vaa Bruhh! 🔓</h1>
            <p className="text-slate-500 font-black italic">Aha! Invite valid aanu. Group-ilekku keraam... 🔥💥🚀</p>
            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ duration: 2 }}
                 className="h-full bg-green-500"
               />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
