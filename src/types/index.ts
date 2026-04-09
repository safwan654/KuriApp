export type GroupRole = 'admin' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  upiId?: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: any;
}


// Traditional Kuri Models
export interface KuriCycle {
  id: string;
  name: string;
  contributionAmount: number;
  totalMembers: number;
  frequency: string;
  startDate: any;
  drawDate: any;
  inviteCode: string;
  defaultHostId?: string;
  status: 'active' | 'completed';
  grandTotalPool: number;
}

export interface KuriMember {
  id: string;
  cycleId: string;
  uid: string;
  name: string;
  isAdmin: boolean;
  upiId?: string;
  joinedAt: any;
}

export interface KuriRound {
  id: string;
  cycleId: string;
  roundNumber: number;
  roundDate: any;
  winnerMemberId?: string;
}

export interface KuriPayment {
  id: string;
  roundId: string;
  memberId: string;
  amount: number;
  isPaid: boolean;
  paidAt?: any;
  isVerified: boolean;
  verifiedAt?: any;
}

// Function Group Models (Koottukuri)
export interface Group {
  id: string;
  name: string;
  description?: string;
  contributionAmount: number;
  inviteCode: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  uid: string;
  role: GroupRole;
  upiId?: string;
}

export interface Event {
  id: string;
  groupId: string;
  title: string;
  date: any;
  hostMemberId: string;
  status: 'upcoming' | 'payment_open' | 'completed';
}

export interface Contribution {
  id: string;
  eventId: string;
  memberId: string;
  amount: number;
  isPaid: boolean;
  paidAt?: any;
  isVerified: boolean;
  verifiedAt?: any;
}
