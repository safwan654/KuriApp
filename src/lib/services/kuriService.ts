import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  arrayUnion,
  writeBatch
} from "firebase/firestore";
import { KuriCycle, KuriMember, KuriRound, KuriPayment } from "@/types";

export const kuriService = {
  // Fetch cycles where user is a member
  getMyCycles: async (uid: string) => {
    // 1. Get member records for this user
    const membersRef = collection(db, "kuriMembers");
    const q = query(membersRef, where("uid", "==", uid));
    const memberSnaps = await getDocs(q);
    
    // 2. Extract cycle IDs
    const cycleIds = memberSnaps.docs.map(doc => doc.data().cycleId || doc.data().kuriCycleId).filter(id => !!id);
    if (cycleIds.length === 0) return [];

    // 3. Fetch the actual cycles
    const cycles: KuriCycle[] = [];
    for (const cycleId of cycleIds) {
      const cycleDoc = await getDoc(doc(db, "kuriCycles", cycleId));
      if (cycleDoc.exists()) {
        cycles.push({ id: cycleDoc.id, ...cycleDoc.data() } as KuriCycle);
      }
    }
    return cycles;
  },

  // Create a new cycle
  createCycle: async (uid: string, data: Partial<KuriCycle>, userName: string) => {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create Cycle
    const cycleRef = await addDoc(collection(db, "kuriCycles"), {
      ...data,
      inviteCode,
      status: 'active',
      createdAt: serverTimestamp(),
    });

    // Create Initial Admin Member
    const memberData: Partial<KuriMember> = {
      cycleId: cycleRef.id,
      uid: uid,
      name: userName,
      isAdmin: true,
      joinedAt: serverTimestamp(),
    };
    
    const memberRef = await addDoc(collection(db, "kuriMembers"), memberData);

    // Initial Member count check / update if needed
    await updateDoc(cycleRef, { defaultHostId: memberRef.id });

    // Generate Rounds
    const batch = writeBatch(db);
    const startDate = data.startDate instanceof Date ? data.startDate : new Date();
    
    for (let i = 1; i <= (data.totalMembers || 0); i++) {
       const roundDate = new Date(startDate);
       roundDate.setMonth(startDate.getMonth() + (i - 1));
       
       const roundRef = doc(collection(db, "kuriRounds"));
       batch.set(roundRef, {
         cycleId: cycleRef.id,
         roundNumber: i,
         roundDate: roundDate,
       });
    }
    await batch.commit();

    return cycleRef.id;
  },

  getCycleDetails: async (id: string) => {
    const cycleDoc = await getDoc(doc(db, "kuriCycles", id));
    if (!cycleDoc.exists()) return null;
    return { id: cycleDoc.id, ...cycleDoc.data() } as KuriCycle;
  },

  getCycleMembers: async (cycleId: string) => {
    const q = query(collection(db, "kuriMembers"), where("cycleId", "==", cycleId));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() } as KuriMember));
  },

  getCycleRounds: async (cycleId: string) => {
    const q = query(collection(db, "kuriRounds"), where("cycleId", "==", cycleId));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() } as KuriRound)).sort((a,b) => a.roundNumber - b.roundNumber);
  },

  getCyclePayments: async (cycleId: string) => {
    const q = query(collection(db, "kuriPayments"), where("cycleId", "==", cycleId));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() } as KuriPayment));
  },

  togglePayment: async (cycleId: string, roundId: string, memberId: string, isPaid: boolean) => {
    const q = query(collection(db, "kuriPayments"), 
      where("roundId", "==", roundId), 
      where("memberId", "==", memberId)
    );
    const snap = await getDocs(q);
    
    if (snap.empty) {
      await addDoc(collection(db, "kuriPayments"), {
        cycleId,
        roundId,
        memberId,
        isPaid,
        paidAt: isPaid ? serverTimestamp() : null,
        isVerified: false
      });
    } else {
      await updateDoc(doc(db, "kuriPayments", snap.docs[0].id), {
        isPaid,
        paidAt: isPaid ? serverTimestamp() : null
      });
    }
  },

  performDraw: async (cycleId: string, roundId: string, winners: string[]) => {
    // 1. Get eligible members (those who haven't won yet)
    const members = await kuriService.getCycleMembers(cycleId);
    const eligible = members.filter(m => !winners.includes(m.id));
    
    if (eligible.length === 0) throw new Error("No eligible members left!");

    // 2. Pick a random winner
    const winner = eligible[Math.floor(Math.random() * eligible.length)];

    // 3. Update Round with winner
    await updateDoc(doc(db, "kuriRounds", roundId), {
      winnerMemberId: winner.id
    });

    return winner;
  },

  addMemberByEmail: async (cycleId: string, email: string) => {
     // Check if user exists (simplification: just add the member record)
     // In a real app, we'd find the user by email first.
     const usersRef = collection(db, "users");
     const q = query(usersRef, where("email", "==", email));
     const userSnap = await getDocs(q);
     
     if (userSnap.empty) throw new Error("User not found!");
     const userData = userSnap.docs[0].data();

     const memberData: Partial<KuriMember> = {
       cycleId,
       uid: userSnap.docs[0].id,
       name: userData.displayName || email.split('@')[0],
       isAdmin: false,
       joinedAt: serverTimestamp(),
     };

     return await addDoc(collection(db, "kuriMembers"), memberData);
  },

  joinByCode: async (code: string, userId: string, userName: string) => {
    // 1. Find cycle
    const q = query(collection(db, "kuriCycles"), where("inviteCode", "==", code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    
    const cycle = { id: snap.docs[0].id, ...snap.docs[0].data() } as KuriCycle;
    
    // 2. Check if already member
    const mq = query(collection(db, "kuriMembers"), 
      where("cycleId", "==", cycle.id),
      where("uid", "==", userId)
    );
    const mSnap = await getDocs(mq);
    if (!mSnap.empty) return { type: 'traditional', id: cycle.id }; // Already joined
    
    // 3. Check slots
    const members = await kuriService.getCycleMembers(cycle.id);
    if (members.length >= cycle.totalMembers) {
      throw new Error("Sorry! Ee Kuri full aayi (No slots left) 😅");
    }
    
    // 4. Join
    const memberRef = await addDoc(collection(db, "kuriMembers"), {
      cycleId: cycle.id,
      uid: userId,
      name: userName,
      isAdmin: false,
      joinedAt: serverTimestamp()
    });
    
    // 5. Initialize payments
    const rounds = await kuriService.getCycleRounds(cycle.id);
    const batch = writeBatch(db);
    rounds.forEach(round => {
       const payRef = doc(collection(db, "kuriPayments"));
       batch.set(payRef, {
          roundId: round.id,
          memberId: memberRef.id,
          cycleId: cycle.id,
          isPaid: false
       });
    });

    await batch.commit();
    
    return { type: 'traditional', id: cycle.id };
  },

  deleteCycle: async (id: string) => {
    await deleteDoc(doc(db, "kuriCycles", id));
  }
};



