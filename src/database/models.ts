// User entity representing an individual user
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Group entity representing a group that users can join
export interface Group {
    id: string;
    name: string;
    description?: string;
    currency: string; // e.g., "USD", "EUR"
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; // User ID
}

// UserGroup represents the relationship between users and groups
export interface UserGroup {
    id: string;
    userId: string;
    groupId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    isActive: boolean;
}

// Payment entity representing a payment made within a group
export interface Payment {
    id: string;
    groupId: string;
    paidBy: string; // User ID who made the payment
    amount: number; // Total amount of the payment
    description: string;
    category?: string; // e.g., "food", "transport", "entertainment"
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

// PaymentParticipant represents which users are involved in a payment
export interface PaymentParticipant {
    id: string;
    paymentId: string;
    userId: string;
    share: number; // The amount this user owes for this payment
    isPaid: boolean; // Whether this user has paid their share
}

// UserBalance represents the balance summary for each user in each group
export interface UserBalance {
    id: string;
    userId: string;
    groupId: string;
    totalPaid: number; // Total amount this user has paid
    totalOwed: number; // Total amount this user owes
    balance: number; // Positive = user is owed money, Negative = user owes money
    lastUpdated: Date;
}
