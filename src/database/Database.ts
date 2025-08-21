import type { Group, Payment, PaymentParticipant, User, UserBalance, UserGroup } from "./models";

export interface DomainDatabase<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    find(predicate: (item: T) => boolean): Promise<T[]>;
    clear(): Promise<void>;
}

export interface Database {
    users: DomainDatabase<User>;
    groups: DomainDatabase<Group>;
    userGroups: DomainDatabase<UserGroup>;
    payments: DomainDatabase<Payment>;
    paymentParticipants: DomainDatabase<PaymentParticipant>;
    userBalances: DomainDatabase<UserBalance>;
}
