"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { kuriService } from "@/lib/services/kuriService";
import Shell from "@/components/layout/Shell";
import { Loader2, ShieldAlert } from "lucide-react";

export default function TraditionalJoinPage() {
  const { code } = useParams() as { code: string };
  const { user, profile } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performJoin = async () => {
      if (!user || !profile) return;
      
      try {
        const result = await kuriService.joinByCode(code, user.uid, profile.displayName);
        if (result) {
          router.push(`/traditional/${result.id}`);
        } else {
          setError("Invalid invite code! 🛑");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong! 😅");
      }
    };

    if (user && profile) {
      performJoin();
    }
  }, [code, user, profile, router]);

  if (!user) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShieldAlert size={48} className="text-amber-500 mb-4" />
          <h1 className="text-2xl font-black mb-2">Login Required! 🔐</h1>
          <p className="text-slate-500 font-bold mb-8">Please login first to join this Kuri.</p>
          <button onClick={() => router.push("/login")} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Go to Login</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        {error ? (
          <div className="animate-up">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
              <ShieldAlert size={40} />
            </div>
            <h1 className="text-3xl font-black mb-4">{error}</h1>
            <button onClick={() => router.push("/traditional")} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Back to List</button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 size={48} className="text-indigo-600 animate-spin mb-6" />
            <h1 className="text-2xl font-black mb-2">Joining Traditional Kuri... 🚀</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Hold tight bruhh! 🔥</p>
          </div>
        )}
      </div>
    </Shell>
  );
}
