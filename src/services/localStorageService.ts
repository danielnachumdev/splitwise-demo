import type { User, Group, UserGroup, Payment, PaymentParticipant, UserBalance } from '../types';

// LocalStorage keys for different entities
const STORAGE_KEYS = {
    USERS: 'splitwise_users',
    GROUPS: 'splitwise_groups',
    USER_GROUPS: 'splitwise_user_groups',
    PAYMENTS: 'splitwise_payments',
    PAYMENT_PARTICIPANTS: 'splitwise_payment_participants',
    USER_BALANCES: 'splitwise_user_balances',
} as const;

// Generic localStorage service wrapper
class LocalStorageService {
    private getItem<T>(key: string): T[] {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(`Error reading from localStorage key ${key}:`, error);
            return [];
        }
    }

    private setItem<T>(key: string, data: T[]): void {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error writing to localStorage key ${key}:`, error);
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // User operations
    async getUsers(): Promise<User[]> {
        return this.getItem<User>(STORAGE_KEYS.USERS);
    }

    async getUserById(id: string): Promise<User | null> {
        const users = await this.getUsers();
        return users.find(user => user.id === id) || null;
    }

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const users = await this.getUsers();
        const newUser: User = {
            ...userData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        users.push(newUser);
        this.setItem(STORAGE_KEYS.USERS, users);
        return newUser;
    }

    async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
        const users = await this.getUsers();
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) return null;

        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            updatedAt: new Date(),
        };

        this.setItem(STORAGE_KEYS.USERS, users);
        return users[userIndex];
    }

    // Group operations
    async getGroups(): Promise<Group[]> {
        return this.getItem<Group>(STORAGE_KEYS.GROUPS);
    }

    async getGroupsByUserId(userId: string): Promise<Group[]> {
        const userGroups = await this.getUserGroups();
        const groupIds = userGroups
            .filter(ug => ug.userId === userId && ug.isActive)
            .map(ug => ug.groupId);

        const allGroups = await this.getGroups();
        return allGroups.filter(group => groupIds.includes(group.id));
    }

    async getGroupById(id: string): Promise<Group | null> {
        const groups = await this.getGroups();
        return groups.find(group => group.id === id) || null;
    }

    async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group> {
        const groups = await this.getGroups();
        const newGroup: Group = {
            ...groupData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        groups.push(newGroup);
        this.setItem(STORAGE_KEYS.GROUPS, groups);
        return newGroup;
    }

    // UserGroup operations
    async getUserGroups(): Promise<UserGroup[]> {
        return this.getItem<UserGroup>(STORAGE_KEYS.USER_GROUPS);
    }

    async addUserToGroup(userId: string, groupId: string, role: 'admin' | 'member' = 'member'): Promise<UserGroup> {
        const userGroups = await this.getUserGroups();
        const newUserGroup: UserGroup = {
            id: this.generateId(),
            userId,
            groupId,
            role,
            joinedAt: new Date(),
            isActive: true,
        };

        userGroups.push(newUserGroup);
        this.setItem(STORAGE_KEYS.USER_GROUPS, userGroups);
        return newUserGroup;
    }

    async removeUserFromGroup(userId: string, groupId: string): Promise<boolean> {
        const userGroups = await this.getUserGroups();
        const userGroupIndex = userGroups.findIndex(ug => ug.userId === userId && ug.groupId === groupId);

        if (userGroupIndex === -1) return false;

        userGroups[userGroupIndex].isActive = false;
        this.setItem(STORAGE_KEYS.USER_GROUPS, userGroups);
        return true;
    }

    // Payment operations
    async getPayments(): Promise<Payment[]> {
        return this.getItem<Payment>(STORAGE_KEYS.PAYMENTS);
    }

    async getPaymentsByGroupId(groupId: string): Promise<Payment[]> {
        const payments = await this.getPayments();
        return payments.filter(payment => payment.groupId === groupId);
    }

    async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
        const payments = await this.getPayments();
        const newPayment: Payment = {
            ...paymentData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        payments.push(newPayment);
        this.setItem(STORAGE_KEYS.PAYMENTS, payments);
        return newPayment;
    }

    // PaymentParticipant operations
    async getPaymentParticipants(): Promise<PaymentParticipant[]> {
        return this.getItem<PaymentParticipant>(STORAGE_KEYS.PAYMENT_PARTICIPANTS);
    }

    async createPaymentParticipants(participants: Omit<PaymentParticipant, 'id'>[]): Promise<PaymentParticipant[]> {
        const allParticipants = await this.getPaymentParticipants();
        const newParticipants: PaymentParticipant[] = participants.map(participant => ({
            ...participant,
            id: this.generateId(),
        }));

        allParticipants.push(...newParticipants);
        this.setItem(STORAGE_KEYS.PAYMENT_PARTICIPANTS, allParticipants);
        return newParticipants;
    }

    // UserBalance operations
    async getUserBalances(): Promise<UserBalance[]> {
        return this.getItem<UserBalance>(STORAGE_KEYS.USER_BALANCES);
    }

    async getUserBalance(userId: string, groupId: string): Promise<UserBalance | null> {
        const balances = await this.getUserBalances();
        return balances.find(balance => balance.userId === userId && balance.groupId === groupId) || null;
    }

    async updateUserBalance(balanceData: Omit<UserBalance, 'id' | 'lastUpdated'>): Promise<UserBalance> {
        const balances = await this.getUserBalances();
        const existingBalanceIndex = balances.findIndex(
            balance => balance.userId === balanceData.userId && balance.groupId === balanceData.groupId
        );

        const newBalance: UserBalance = {
            ...balanceData,
            id: existingBalanceIndex !== -1 ? balances[existingBalanceIndex].id : this.generateId(),
            lastUpdated: new Date(),
        };

        if (existingBalanceIndex !== -1) {
            balances[existingBalanceIndex] = newBalance;
        } else {
            balances.push(newBalance);
        }

        this.setItem(STORAGE_KEYS.USER_BALANCES, balances);
        return newBalance;
    }

    // Utility methods
    async clearAllData(): Promise<void> {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    async getDataSize(): Promise<number> {
        let totalSize = 0;
        Object.values(STORAGE_KEYS).forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                totalSize += new Blob([data]).size;
            }
        });
        return totalSize;
    }

    // Demo data initialization
    async initializeDemoData(): Promise<void> {
        // Check if demo data already exists
        const existingGroups = await this.getGroups();
        if (existingGroups.length > 0) return;

        try {
            // Create demo users
            const user1 = await this.createUser({
                name: 'Alice Johnson',
                email: 'alice@demo.com',
            });

            const user2 = await this.createUser({
                name: 'Bob Smith',
                email: 'bob@demo.com',
            });

            const user3 = await this.createUser({
                name: 'Carol Davis',
                email: 'carol@demo.com',
            });

            // Create demo group
            const group = await this.createGroup({
                name: 'Roommates',
                description: 'Shared expenses for our apartment',
                currency: 'USD',
                createdBy: user1.id,
            });

            // Add users to group
            await this.addUserToGroup(user1.id, group.id, 'admin');
            await this.addUserToGroup(user2.id, group.id, 'member');
            await this.addUserToGroup(user3.id, group.id, 'member');

            // Create demo payments
            const payment1 = await this.createPayment({
                groupId: group.id,
                paidBy: user1.id,
                amount: 120.00,
                description: 'Grocery shopping',
                category: 'food',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            });

            const payment2 = await this.createPayment({
                groupId: group.id,
                paidBy: user2.id,
                amount: 85.50,
                description: 'Internet bill',
                category: 'utilities',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            });

            const payment3 = await this.createPayment({
                groupId: group.id,
                paidBy: user3.id,
                amount: 45.00,
                description: 'Pizza delivery',
                category: 'food',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            });

            // Create payment participants
            await this.createPaymentParticipants([
                {
                    paymentId: payment1.id,
                    userId: user1.id,
                    share: 40.00,
                    isPaid: true,
                },
                {
                    paymentId: payment1.id,
                    userId: user2.id,
                    share: 40.00,
                    isPaid: false,
                },
                {
                    paymentId: payment1.id,
                    userId: user3.id,
                    share: 40.00,
                    isPaid: false,
                },
            ]);

            await this.createPaymentParticipants([
                {
                    paymentId: payment2.id,
                    userId: user1.id,
                    share: 28.50,
                    isPaid: false,
                },
                {
                    paymentId: payment2.id,
                    userId: user2.id,
                    share: 28.50,
                    isPaid: true,
                },
                {
                    paymentId: payment2.id,
                    userId: user3.id,
                    share: 28.50,
                    isPaid: false,
                },
            ]);

            await this.createPaymentParticipants([
                {
                    paymentId: payment3.id,
                    userId: user1.id,
                    share: 15.00,
                    isPaid: false,
                },
                {
                    paymentId: payment3.id,
                    userId: user2.id,
                    share: 15.00,
                    isPaid: false,
                },
                {
                    paymentId: payment3.id,
                    userId: user3.id,
                    share: 15.00,
                    isPaid: true,
                },
            ]);

            // Initialize user balances
            await this.updateUserBalance({
                userId: user1.id,
                groupId: group.id,
                totalPaid: 40.00,
                totalOwed: 43.50,
                balance: -3.50,
            });

            await this.updateUserBalance({
                userId: user2.id,
                groupId: group.id,
                totalPaid: 113.50,
                totalOwed: 55.00,
                balance: 58.50,
            });

            await this.updateUserBalance({
                userId: user3.id,
                groupId: group.id,
                totalPaid: 15.00,
                totalOwed: 83.50,
                balance: -68.50,
            });

        } catch (error) {
            console.error('Error initializing demo data:', error);
        }
    }

    // Recalculate user balances for a group
    async recalculateGroupBalances(groupId: string): Promise<void> {
        try {
            // Get all payments for the group
            const payments = await this.getPaymentsByGroupId(groupId);

            // Get all participants for these payments
            const allParticipants = await this.getPaymentParticipants();
            const groupParticipants = allParticipants.filter(pp =>
                payments.some(payment => payment.id === pp.paymentId)
            );

            // Get all users in the group
            const userGroups = await this.getUserGroups();
            const memberIds = userGroups
                .filter(ug => ug.groupId === groupId && ug.isActive)
                .map(ug => ug.userId);

            // Calculate balances for each user
            for (const userId of memberIds) {
                let totalPaid = 0;
                let totalOwed = 0;

                // Calculate total paid (payments made by this user)
                const paymentsMade = payments.filter(p => p.paidBy === userId);
                totalPaid = paymentsMade.reduce((sum, p) => sum + p.amount, 0);

                // Calculate total owed (shares in payments)
                const userShares = groupParticipants.filter(pp => pp.userId === userId);
                totalOwed = userShares.reduce((sum, pp) => sum + pp.share, 0);

                // Update balance
                await this.updateUserBalance({
                    userId,
                    groupId,
                    totalPaid,
                    totalOwed,
                    balance: totalPaid - totalOwed,
                });
            }
        } catch (error) {
            console.error('Error recalculating group balances:', error);
        }
    }

    // Calculate detailed debt relationships between users in a group
    async getGroupDebtBreakdown(groupId: string): Promise<Array<{
        fromUserId: string;
        toUserId: string;
        amount: number;
        description: string;
    }>> {
        try {
            const payments = await this.getPaymentsByGroupId(groupId);
            const participants = await this.getPaymentParticipants();
            const userGroups = await this.getUserGroups();

            // Get active group members
            const memberIds = userGroups
                .filter(ug => ug.groupId === groupId && ug.isActive)
                .map(ug => ug.userId);

            const debtBreakdown: Array<{
                fromUserId: string;
                toUserId: string;
                amount: number;
                description: string;
            }> = [];

            // For each payment, calculate who owes what to whom
            for (const payment of payments) {
                const paymentParticipants = participants.filter(pp => pp.paymentId === payment.id);

                for (const participant of paymentParticipants) {
                    if (participant.userId !== payment.paidBy) {
                        // This participant owes money to the payer
                        debtBreakdown.push({
                            fromUserId: participant.userId,
                            toUserId: payment.paidBy,
                            amount: participant.share,
                            description: payment.description,
                        });
                    }
                }
            }

            // Consolidate debts between the same users
            const consolidatedDebts = new Map<string, number>();

            for (const debt of debtBreakdown) {
                const key = `${debt.fromUserId}-${debt.toUserId}`;
                const existingAmount = consolidatedDebts.get(key) || 0;
                consolidatedDebts.set(key, existingAmount + debt.amount);
            }

            // Convert back to array format
            const result: Array<{
                fromUserId: string;
                toUserId: string;
                amount: number;
                description: string;
            }> = [];

            for (const [key, amount] of consolidatedDebts) {
                const [fromUserId, toUserId] = key.split('-');
                result.push({
                    fromUserId,
                    toUserId,
                    amount,
                    description: 'Consolidated debt',
                });
            }

            return result;
        } catch (error) {
            console.error('Error calculating debt breakdown:', error);
            return [];
        }
    }
}

// Export a singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;
