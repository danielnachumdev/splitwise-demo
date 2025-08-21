import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import type { Payment, User } from '../../../database';
import PaymentPreview from './PaymentPreview';
import './PaymentsPanel.css';

interface PaymentsPanelProps {
    payments: Payment[];
    users: User[];
    currency: string;
    onPaymentClick: (payment: Payment) => void;
}

const PaymentsPanel: React.FC<PaymentsPanelProps> = ({
    payments,
    users,
    currency,
    onPaymentClick
}) => {
    const getPaidByUser = (payment: Payment): User | undefined => {
        return users.find(user => user.id === payment.paidBy);
    };

    return (
        <Paper className="payments-panel">
            <Typography variant="h6" component="h2" className="payments-panel-title">
                Payment History ({payments.length})
            </Typography>

            {payments.length === 0 ? (
                <Box className="payments-panel-empty-state">
                    <Typography variant="body2" className="payments-panel-empty-text">
                        No payments yet. Start adding expenses to see them here.
                    </Typography>
                </Box>
            ) : (
                <Box className="payments-panel-content">
                    <Box className="payments-panel-grid">
                        {payments.map((payment) => {
                            const paidByUser = getPaidByUser(payment);
                            return (
                                <Box key={payment.id} className="payments-panel-item">
                                    <PaymentPreview
                                        payment={payment}
                                        paidByUser={paidByUser}
                                        currency={currency}
                                        onClick={onPaymentClick}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default PaymentsPanel;
