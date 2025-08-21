import type { DatabaseService as DatabaseServiceInterface } from '../database/Database';
import { createLocalStorageDatabase } from '../database/LocalStorageDatabase';

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
export const databaseService: DatabaseServiceInterface = {
    users: createLocalStorageDatabase(STORAGE_KEYS.USERS),
    groups: createLocalStorageDatabase(STORAGE_KEYS.GROUPS),
    userGroups: createLocalStorageDatabase(STORAGE_KEYS.USER_GROUPS),
    payments: createLocalStorageDatabase(STORAGE_KEYS.PAYMENTS),
    paymentParticipants: createLocalStorageDatabase(STORAGE_KEYS.PAYMENT_PARTICIPANTS),
    userBalances: createLocalStorageDatabase(STORAGE_KEYS.USER_BALANCES),
};

// Utility functions
export const clearAllData = async (): Promise<void> => {
    await Promise.all([
        databaseService.users.clear(),
        databaseService.groups.clear(),
        databaseService.userGroups.clear(),
        databaseService.payments.clear(),
        databaseService.paymentParticipants.clear(),
        databaseService.userBalances.clear(),
    ]);
};

export const getDataSize = async (): Promise<number> => {
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            totalSize += new Blob([data]).size;
        }
    });
    return totalSize;
};
