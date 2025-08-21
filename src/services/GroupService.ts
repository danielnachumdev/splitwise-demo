import { databaseService } from './DatabaseService';
import type { Group, UserGroup } from '../database';

export const groupService = {
    async getGroups(): Promise<Group[]> {
        return databaseService.groups.getAll();
    },

    async getGroupById(id: string): Promise<Group | null> {
        return databaseService.groups.getById(id);
    },

    async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group> {
        return databaseService.groups.create(groupData);
    },

    async updateGroup(id: string, updates: Partial<Omit<Group, 'id' | 'createdAt'>>): Promise<Group | null> {
        return databaseService.groups.update(id, updates);
    },

    async deleteGroup(id: string): Promise<boolean> {
        return databaseService.groups.delete(id);
    },

    async getGroupsByUserId(userId: string): Promise<Group[]> {
        const userGroups = await databaseService.userGroups.find(ug => ug.userId === userId && ug.isActive);
        const groupIds = userGroups.map(ug => ug.groupId);

        const allGroups = await groupService.getGroups();
        return allGroups.filter(group => groupIds.includes(group.id));
    },

    async addUserToGroup(userId: string, groupId: string, role: 'admin' | 'member' = 'member'): Promise<UserGroup> {
        return databaseService.userGroups.create({
            userId,
            groupId,
            role,
            joinedAt: new Date(),
            isActive: true,
        });
    },

    async removeUserFromGroup(userId: string, groupId: string): Promise<boolean> {
        const userGroups = await databaseService.userGroups.find(ug => ug.userId === userId && ug.groupId === groupId);
        if (userGroups.length === 0) return false;

        const userGroup = userGroups[0];
        return databaseService.userGroups.update(userGroup.id, { isActive: false }) !== null;
    },

    async getUserGroups(): Promise<UserGroup[]> {
        return databaseService.userGroups.getAll();
    }
};
