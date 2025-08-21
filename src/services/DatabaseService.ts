import type { Database } from '../database/Database';
import { localStorageDatabase } from '../database/LocalStorageDatabase';

// Create database service object
export const databaseService: Database = localStorageDatabase;
