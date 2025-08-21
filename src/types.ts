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

// Extended interfaces with relationships for easier data access
export interface UserWithGroups extends User {
    groups: Group[];
    balances: UserBalance[];
}

export interface GroupWithUsers extends Group {
    users: User[];
    payments: Payment[];
    balances: UserBalance[];
}

export interface PaymentWithParticipants extends Payment {
    participants: PaymentParticipant[];
    paidByUser: User;
}

// Utility types for common operations
export type PaymentStatus = 'pending' | 'settled' | 'cancelled';

export type GroupRole = 'admin' | 'member';

export type PaymentCategory =
    | 'food'
    | 'transport'
    | 'entertainment'
    | 'utilities'
    | 'rent'
    | 'shopping'
    | 'other';

// DTOs (Data Transfer Objects) for API requests/responses
export interface CreateUserRequest {
    name: string;
    email: string;
    avatar?: string;
}

export interface CreateGroupRequest {
    name: string;
    description?: string;
    currency: string;
    memberIds: string[]; // Array of user IDs to add to the group
}

export interface CreatePaymentRequest {
    groupId: string;
    amount: number;
    description: string;
    category?: PaymentCategory;
    date: Date;
    participants: {
        userId: string;
        share: number;
    }[];
}

export interface UpdatePaymentRequest {
    amount?: number;
    description?: string;
    category?: PaymentCategory;
    date?: Date;
    participants?: {
        userId: string;
        share: number;
    }[];
}

// Response types for API calls
export interface GroupSummary {
    group: Group;
    totalPayments: number;
    totalBalance: number;
    memberCount: number;
    recentPayments: Payment[];
}

export interface UserGroupSummary {
    user: User;
    group: Group;
    balance: UserBalance;
    recentPayments: Payment[];
}

// Error types
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

// Filter and search types
export interface PaymentFilters {
    groupId?: string;
    userId?: string;
    category?: PaymentCategory;
    dateFrom?: Date;
    dateTo?: Date;
    minAmount?: number;
    maxAmount?: number;
}

export interface GroupFilters {
    userId?: string;
    search?: string;
    isActive?: boolean;
}
