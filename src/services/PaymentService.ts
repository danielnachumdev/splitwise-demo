import { databaseService } from './DatabaseService';
import type { Payment, PaymentParticipant } from '../types';

export const paymentService = {
    async getPayments(): Promise<Payment[]> {
        return databaseService.payments.getAll();
    },

    async getPaymentById(id: string): Promise<Payment | null> {
        return databaseService.payments.getById(id);
    },

    async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
        return databaseService.payments.create(paymentData);
    },

    async updatePayment(id: string, updates: Partial<Omit<Payment, 'id' | 'createdAt'>>): Promise<Payment | null> {
        return databaseService.payments.update(id, updates);
    },

    async deletePayment(id: string): Promise<boolean> {
        return databaseService.payments.delete(id);
    },

    async getPaymentsByGroupId(groupId: string): Promise<Payment[]> {
        return databaseService.payments.find(payment => payment.groupId === groupId);
    },

    async getPaymentParticipants(): Promise<PaymentParticipant[]> {
        return databaseService.paymentParticipants.getAll();
    },

    async createPaymentParticipants(participants: Omit<PaymentParticipant, 'id'>[]): Promise<PaymentParticipant[]> {
        const createdParticipants: PaymentParticipant[] = [];

        for (const participant of participants) {
            const created = await databaseService.paymentParticipants.create(participant);
            createdParticipants.push(created);
        }

        return createdParticipants;
    },

    async updatePaymentParticipant(id: string, updates: Partial<Omit<PaymentParticipant, 'id'>>): Promise<PaymentParticipant | null> {
        return databaseService.paymentParticipants.update(id, updates);
    }
};
