import { databaseService } from './DatabaseService';
import type { User } from '../types';

export const userService = {
    async getUsers(): Promise<User[]> {
        return databaseService.users.getAll();
    },

    async getUserById(id: string): Promise<User | null> {
        return databaseService.users.getById(id);
    },

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        return databaseService.users.create(userData);
    },

    async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
        return databaseService.users.update(id, updates);
    },

    async deleteUser(id: string): Promise<boolean> {
        return databaseService.users.delete(id);
    }
};
