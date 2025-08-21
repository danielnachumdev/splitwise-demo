import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import type { Payment, PaymentParticipant, User } from '../database';

interface PaymentStatementProps {
    payment: Payment;
    participants: PaymentParticipant[];
    users: User[];
    currency: string;
}

const PaymentStatement: React.FC<PaymentStatementProps> = ({
    payment,
    participants,
    users,
    currency,
}) => {
    const getCurrencySymbol = (currencyCode: string): string => {
        const symbols: Record<string, string> = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'CAD': 'C$',
            'AUD': 'A$',
            'JPY': '¥',
        };
        return symbols[currencyCode] || currencyCode;
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getPaidByUser = (): User | undefined => {
        return users.find(user => user.id === payment.paidBy);
    };

    const getParticipantUsers = (): Array<{ user: User; share: number; isPaid: boolean }> => {
        return participants.map(participant => {
            const user = users.find(u => u.id === participant.userId);
            return {
                user: user!,
                share: participant.share,
                isPaid: participant.isPaid,
            };
        });
    };

    const paidByUser = getPaidByUser();
    const participantUsers = getParticipantUsers();

    return (
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            {/* Payment Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {payment.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Paid by {paidByUser?.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(payment.date)}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {getCurrencySymbol(currency)}{payment.amount.toFixed(2)}
                    </Typography>
                    {payment.category && (
                        <Chip
                            label={payment.category}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Participants */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Split between {participantUsers.length} people:
                </Typography>

                <List dense sx={{ py: 0 }}>
                    {participantUsers.map(({ user, share, isPaid }) => (
                        <ListItem key={user.id} sx={{ px: 0, py: 0.5 }}>
                            <ListItemAvatar sx={{ minWidth: 32 }}>
                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2">
                                            {user.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {getCurrencySymbol(currency)}{share.toFixed(2)}
                                            </Typography>
                                            <Chip
                                                label={isPaid ? 'Paid' : 'Pending'}
                                                size="small"
                                                color={isPaid ? 'success' : 'warning'}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default PaymentStatement;
