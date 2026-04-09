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
  writeBatch
} from "firebase/firestore";
import { Group, GroupMember, Event, Contribution } from "@/types";

export const groupService = {
  // Fetch groups where user is a member
  getMyGroups: async (uid: string) => {
    const membersRef = collection(db, "groupMembers");
    const q = query(membersRef, where("uid", "==", uid));
    const memberSnaps = await getDocs(q);
    
    const groupIds = memberSnaps.docs.map(doc => doc.data().groupId).filter(id => !!id);
    if (groupIds.length === 0) return [];

    const groups: Group[] = [];
    for (const groupId of groupIds) {
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (groupDoc.exists()) {
        groups.push({ id: groupDoc.id, ...groupDoc.data() } as Group);
      }
    }
    return groups;
  },

  // Create a new group
  createGroup: async (uid: string, data: Partial<Group>, userName: string) => {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create Group
    const groupRef = await addDoc(collection(db, "groups"), {
      ...data,
      inviteCode,
      createdAt: serverTimestamp(),
    });

    // Create Initial Admin Member
    await addDoc(collection(db, "groupMembers"), {
      groupId: groupRef.id,
      uid: uid,
      name: userName,
      role: 'admin',
      joinedAt: serverTimestamp(),
    });

    return groupRef.id;
  },

  getGroupDetails: async (id: string) => {
    const groupDoc = await getDoc(doc(db, "groups", id));
    if (!groupDoc.exists()) return null;
    return { id: groupDoc.id, ...groupDoc.data() } as Group;
  },

  getGroupMembers: async (groupId: string) => {
    const q = query(collection(db, "groupMembers"), where("groupId", "==", groupId));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() } as GroupMember));
  },

  getGroupEvents: async (groupId: string) => {
    const q = query(collection(db, "groupEvents"), where("groupId", "==", groupId));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() } as Event)).sort((a,b) => b.date - a.date);
  },

  getEventContributions: async (eventId: string) => {
    const q = query(collection(db, "groupContributions"), where("eventId", "==", eventId));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() } as Contribution));
  },

  toggleContribution: async (memberId: string, eventId: string, isPaid: boolean) => {
    const q = query(collection(db, "groupContributions"), 
      where("eventId", "==", eventId), 
      where("memberId", "==", memberId)
    );
    const snap = await getDocs(q);
    
    if (snap.empty) {
      await addDoc(collection(db, "groupContributions"), {
        eventId,
        memberId,
        isPaid,
        paidAt: isPaid ? serverTimestamp() : null,
        isVerified: false
      });
    } else {
      await updateDoc(doc(db, "groupContributions", snap.docs[0].id), {
        isPaid,
        paidAt: isPaid ? serverTimestamp() : null
      });
    }
  },

  addEvent: async (groupId: string, data: Partial<Event>) => {
    return await addDoc(collection(db, "groupEvents"), {
      ...data,
      groupId,
      createdAt: serverTimestamp(),
    });
  },

  joinByCode: async (code: string, userId: string, userName: string) => {
    // 1. Find group
    const q = query(collection(db, "groups"), where("inviteCode", "==", code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    
    const group = { id: snap.docs[0].id, ...snap.docs[0].data() } as Group;
    
    // 2. Check if already member
    const mq = query(collection(db, "groupMembers"), 
      where("groupId", "==", group.id),
      where("uid", "==", userId)
    );
    const mSnap = await getDocs(mq);
    if (!mSnap.empty) return { type: 'koottukuri', id: group.id };
    
    // 3. Join
    await addDoc(collection(db, "groupMembers"), {
      groupId: group.id,
      uid: userId,
      name: userName,
      role: 'member',
      joinedAt: serverTimestamp(),
      isApproved: !group.requireAdminApproval
    });
    
    return { type: 'koottukuri', id: group.id };
  },

  deleteGroup: async (id: string) => {
    await deleteDoc(doc(db, "groups", id));
  },

  getEventDetails: async (groupId: string, eventId: string) => {
    const docSnap = await getDoc(doc(db, "groupEvents", eventId));
    if (!docSnap.exists()) throw new Error("Event not found");
    return { id: docSnap.id, ...docSnap.data() } as any;
  },

  updateEvent: async (groupId: string, eventId: string, data: any) => {
    await updateDoc(doc(db, "groupEvents", eventId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  markPayment: async (groupId: string, eventId: string, memberId: string, status: string) => {
    await updateDoc(doc(db, "groupEvents", eventId), {
      [`payments.${memberId}`]: {
        status,
        updatedAt: serverTimestamp()
      }
    });
  },

  deleteEvent: async (groupId: string, eventId: string) => {
    await deleteDoc(doc(db, "groupEvents", eventId));
  },

  updateMemberRole: async (memberId: string, role: 'admin' | 'member') => {
    await updateDoc(doc(db, "groupMembers", memberId), {
       role,
       updatedAt: serverTimestamp()
    });
  },

  removeMember: async (memberId: string) => {
    await deleteDoc(doc(db, "groupMembers", memberId));
  }
};



