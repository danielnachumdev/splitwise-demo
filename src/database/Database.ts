export interface Database<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    find(predicate: (item: T) => boolean): Promise<T[]>;
    clear(): Promise<void>;
}

export interface Entity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DatabaseService {
    users: Database<User>;
    groups: Database<Group>;
    userGroups: Database<UserGroup>;
    payments: Database<Payment>;
    paymentParticipants: Database<PaymentParticipant>;
    userBalances: Database<UserBalance>;
}

// Core entity types
export interface User extends Entity {
    name: string;
    email: string;
    avatar?: string;
}

export interface Group extends Entity {
    name: string;
    description?: string;
    currency: string;
    createdBy: string;
}

export interface UserGroup extends Entity {
    userId: string;
    groupId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    isActive: boolean;
}

export interface Payment extends Entity {
    groupId: string;
    paidBy: string;
    amount: number;
    description: string;
    category?: string;
    date: Date;
}

export interface PaymentParticipant extends Entity {
    paymentId: string;
    userId: string;
    share: number;
    isPaid: boolean;
}

export interface UserBalance extends Entity {
    userId: string;
    groupId: string;
    totalPaid: number;
    totalOwed: number;
    balance: number;
    lastUpdated: Date;
}
