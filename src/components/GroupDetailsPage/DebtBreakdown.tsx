import React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Divider,
    Alert,
} from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import type { User } from '../../database';

interface DebtBreakdownProps {
    debtBreakdown: Array<{
        fromUserId: string;
        toUserId: string;
        amount: number;
        description: string;
    }>;
    users: User[];
    currency: string;
}

const DebtBreakdown: React.FC<DebtBreakdownProps> = ({
    debtBreakdown,
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

    const getUserById = (userId: string): User | undefined => {
        return users.find(user => user.id === userId);
    };

    const getDebtsByUser = (userId: string) => {
        return {
            owes: debtBreakdown.filter(debt => debt.fromUserId === userId),
            owed: debtBreakdown.filter(debt => debt.toUserId === userId),
        };
    };

    const formatAmount = (amount: number): string => {
        return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
    };

    if (debtBreakdown.length === 0) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                    Debt Breakdown
                </Typography>
                <Alert severity="info">
                    No debts to settle. Everyone is balanced!
                </Alert>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                Debt Breakdown
            </Typography>

            {users.map((user) => {
                const { owes, owed } = getDebtsByUser(user.id);
                const totalOwes = owes.reduce((sum, debt) => sum + debt.amount, 0);
                const totalOwed = owed.reduce((sum, debt) => sum + debt.amount, 0);
                const netBalance = totalOwed - totalOwes;

                if (owes.length === 0 && owed.length === 0) {
                    return null; // Skip users with no debts
                }

                return (
                    <Box key={user.id} sx={{ mb: 3 }}>
                        {/* User Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.875rem' }}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                                {user.name}
                            </Typography>
                            <Chip
                                label={`Net: ${formatAmount(netBalance)}`}
                                color={netBalance > 0 ? 'success' : netBalance < 0 ? 'error' : 'default'}
                                variant="outlined"
                                size="small"
                            />
                        </Box>

                        {/* Debts Owed TO this user */}
                        {owed.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500, mb: 1 }}>
                                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                    Owed to {user.name} ({formatAmount(totalOwed)})
                                </Typography>
                                <List dense sx={{ py: 0, bgcolor: 'success.50', borderRadius: 1 }}>
                                    {owed.map((debt, index) => {
                                        const debtor = getUserById(debt.fromUserId);
                                        return (
                                            <ListItem key={index} sx={{ px: 2, py: 0.5 }}>
                                                <ListItemAvatar sx={{ minWidth: 32 }}>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                                        {debtor?.name.charAt(0).toUpperCase() || '?'}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2">
                                                                {debtor?.name || 'Unknown User'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                                                                {formatAmount(debt.amount)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={debt.description}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Box>
                        )}

                        {/* Debts this user OWES */}
                        {owes.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="error.main" sx={{ fontWeight: 500, mb: 1 }}>
                                    <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                    {user.name} owes ({formatAmount(totalOwes)})
                                </Typography>
                                <List dense sx={{ py: 0, bgcolor: 'error.50', borderRadius: 1 }}>
                                    {owes.map((debt, index) => {
                                        const creditor = getUserById(debt.toUserId);
                                        return (
                                            <ListItem key={index} sx={{ px: 2, py: 0.5 }}>
                                                <ListItemAvatar sx={{ minWidth: 32 }}>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                                        {creditor?.name.charAt(0).toUpperCase() || '?'}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2">
                                                                {creditor?.name || 'Unknown User'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'error.main' }}>
                                                                {formatAmount(debt.amount)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={debt.description}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Box>
                        )}

                        {user.id !== users[users.length - 1]?.id && (
                            <Divider sx={{ mt: 2 }} />
                        )}
                    </Box>
                );
            })}
        </Paper>
    );
};

export default DebtBreakdown;
