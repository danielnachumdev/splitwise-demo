import { databaseService } from './DatabaseService';
import type { UserBalance } from '../types';

export const balanceService = {
    async getUserBalances(): Promise<UserBalance[]> {
        return databaseService.userBalances.getAll();
    },

    async getUserBalance(userId: string, groupId: string): Promise<UserBalance | null> {
        const balances = await databaseService.userBalances.find(
            balance => balance.userId === userId && balance.groupId === groupId
        );
        return balances.length > 0 ? balances[0] : null;
    },

    async updateUserBalance(balanceData: Omit<UserBalance, 'id' | 'lastUpdated'>): Promise<UserBalance> {
        const existingBalance = await balanceService.getUserBalance(balanceData.userId, balanceData.groupId);

        if (existingBalance) {
            return databaseService.userBalances.update(existingBalance.id, balanceData) as Promise<UserBalance>;
        } else {
            // For new balances, we need to include lastUpdated
            const newBalanceData = {
                ...balanceData,
                lastUpdated: new Date()
            };
            return databaseService.userBalances.create(newBalanceData);
        }
    },

    async recalculateGroupBalances(_groupId: string): Promise<void> {
        // This method will be implemented with business logic
        // It will use other services to calculate and update balances
        throw new Error('Not implemented yet - requires integration with other services');
    },

    async getGroupDebtBreakdown(_groupId: string): Promise<Array<{
        fromUserId: string;
        toUserId: string;
        amount: number;
        description: string;
    }>> {
        // This method will be implemented with business logic
        // It will use other services to calculate debt relationships
        throw new Error('Not implemented yet - requires integration with other services');
    }
};
