import type { Database, Entity } from './Database';

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
export const createLocalStorageDatabase = <T extends Entity>(storageKey: string): Database<T> => ({
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
