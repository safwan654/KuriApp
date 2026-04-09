import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export const reportService = {
  getUserFinancials: async (uid: string) => {
    let totalContributed = 0;
    let totalReceived = 0;
    let pendingPayments = 0;

    // 1. Koottukuri Module
    const groupMembersRef = collection(db, "groupMembers");
    const qGroups = query(groupMembersRef, where("uid", "==", uid));
    const groupMemberSnaps = await getDocs(qGroups);

    for (const memberSnap of groupMemberSnaps.docs) {
      const { groupId } = memberSnap.data();
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (!groupDoc.exists()) continue;
      const groupData = groupDoc.data();
      const contributionAmount = groupData.contributionAmount || 0;

      // Fetch all events for this group
      const eventsRef = collection(db, "groupEvents");
      const qEvents = query(eventsRef, where("groupId", "==", groupId));
      const eventSnaps = await getDocs(qEvents);

      for (const eventDoc of eventSnaps.docs) {
        const event = eventDoc.data();
        const myPayment = event.payments?.[memberSnap.id];

        if (event.hostName === memberSnap.data().name) {
          // I am host - calculate how much I GOT
          const verifiedCount = Object.values(event.payments || {}).filter((p: any) => p.status === 'Verified').length;
          totalReceived += (verifiedCount * contributionAmount);
        } else {
          // I am a contributor
          if (myPayment?.status === 'Verified') {
            totalContributed += contributionAmount;
          } else if (event.status === 'PaymentOpen') {
            pendingPayments += contributionAmount;
          }
        }
      }
    }

    // 2. Traditional Kuri Module
    const kuriMembersRef = collection(db, "kuriMembers");
    const qKuri = query(kuriMembersRef, where("uid", "==", uid));
    const kuriMemberSnaps = await getDocs(qKuri);

    for (const memberSnap of kuriMemberSnaps.docs) {
      const { cycleId } = memberSnap.data();
      const cycleDoc = await getDoc(doc(db, "kuriCycles", cycleId));
      if (!cycleDoc.exists()) continue;
      const cycleData = cycleDoc.data();
      const amount = cycleData.contributionAmount || 0;

      // Fetch all rounds
      const roundsRef = collection(db, "kuriRounds");
      const qRounds = query(roundsRef, where("cycleId", "==", cycleId));
      const roundSnaps = await getDocs(qRounds);

      for (const roundDoc of roundSnaps.docs) {
        const round = roundDoc.data();
        const myPayment = round.payments?.[memberSnap.id];

        if (round.winnerName === memberSnap.data().name) {
          totalReceived += round.prizeAmount || 0;
        }
        
        if (myPayment?.status === 'Verified') {
          totalContributed += amount;
        } else if (round.status === 'Open') {
          pendingPayments += amount;
        }
      }
    }

    return { totalContributed, totalReceived, pendingPayments };
  }
};
