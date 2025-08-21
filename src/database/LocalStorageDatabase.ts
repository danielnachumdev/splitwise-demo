import type { DomainDatabase, Database } from './Database';

// Helper functions
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getItem = <T>(storageKey: string): T[] => {
    try {
        const item = localStorage.getItem(storageKey);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error(`Error reading from localStorage key ${storageKey}:`, error);
        return [];
    }
};

const setItem = <T>(storageKey: string, data: T[]): void => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing to localStorage key ${storageKey}:`, error);
    }
};

// Factory function to create a database implementation
const createLocalStorageDatabase = <T extends { id: string; createdAt?: Date; updatedAt?: Date }>(storageKey: string): DomainDatabase<T> => ({
    async getAll(): Promise<T[]> {
        return getItem<T>(storageKey);
    },

    async getById(id: string): Promise<T | null> {
        const items = await getItem<T>(storageKey);
        return items.find(item => item.id === id) || null;
    },

    async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
        const items = await getItem<T>(storageKey);
        const newItem: T = {
            ...data,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        } as T;

        items.push(newItem);
        setItem(storageKey, items);
        return newItem;
    },

    async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
        const items = await getItem<T>(storageKey);
        const itemIndex = items.findIndex(item => item.id === id);

        if (itemIndex === -1) return null;

        items[itemIndex] = {
            ...items[itemIndex],
            ...updates,
            updatedAt: new Date(),
        };

        setItem(storageKey, items);
        return items[itemIndex];
    },

    async delete(id: string): Promise<boolean> {
        const items = await getItem<T>(storageKey);
        const itemIndex = items.findIndex(item => item.id === id);

        if (itemIndex === -1) return false;

        items.splice(itemIndex, 1);
        setItem(storageKey, items);
        return true;
    },

    async find(predicate: (item: T) => boolean): Promise<T[]> {
        const items = await getItem<T>(storageKey);
        return items.filter(predicate);
    },

    async clear(): Promise<void> {
        localStorage.removeItem(storageKey);
    }
});

// Storage keys for different entities
const STORAGE_KEYS = {
    USERS: 'splitwise_users',
    GROUPS: 'splitwise_groups',
    USER_GROUPS: 'splitwise_user_groups',
    PAYMENTS: 'splitwise_payments',
    PAYMENT_PARTICIPANTS: 'splitwise_payment_participants',
    USER_BALANCES: 'splitwise_user_balances',
} as const;

// Create database service object
export const localStorageDatabase: Database = {
    users: createLocalStorageDatabase(STORAGE_KEYS.USERS),
    groups: createLocalStorageDatabase(STORAGE_KEYS.GROUPS),
    userGroups: createLocalStorageDatabase(STORAGE_KEYS.USER_GROUPS),
    payments: createLocalStorageDatabase(STORAGE_KEYS.PAYMENTS),
    paymentParticipants: createLocalStorageDatabase(STORAGE_KEYS.PAYMENT_PARTICIPANTS),
    userBalances: createLocalStorageDatabase(STORAGE_KEYS.USER_BALANCES),
};