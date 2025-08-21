// Export the main database service object for external use
export { databaseService, clearAllData, getDataSize } from '../services/DatabaseService';

// Export all types that might be needed by external consumers
export type {
    Database,
    Entity,
    DatabaseService,
    User,
    Group,
    UserGroup,
    Payment,
    PaymentParticipant,
    UserBalance
} from './Database';
