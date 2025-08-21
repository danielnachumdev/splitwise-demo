import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Chip,
    Divider,
} from '@mui/material';
import type { User, UserBalance } from '../database';

interface UserDisplayProps {
    user: User;
    balance: UserBalance | null;
    currency: string;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ user, balance, currency }) => {
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

    const getBalanceColor = (balanceAmount: number): 'success' | 'error' | 'default' => {
        if (balanceAmount > 0) return 'success';
        if (balanceAmount < 0) return 'error';
        return 'default';
    };

    const getBalanceText = (balanceAmount: number): string => {
        if (balanceAmount > 0) return `Owed ${getCurrencySymbol(currency)}${balanceAmount.toFixed(2)}`;
        if (balanceAmount < 0) return `Owes ${getCurrencySymbol(currency)}${Math.abs(balanceAmount).toFixed(2)}`;
        return 'Settled up';
    };

    const formatBalance = (balanceAmount: number): string => {
        const absAmount = Math.abs(balanceAmount);
        return `${balanceAmount >= 0 ? '+' : '-'}${getCurrencySymbol(currency)}${absAmount.toFixed(2)}`;
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.875rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.name}
                    </Typography>

                    {balance && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography
                                variant="caption"
                                color={getBalanceColor(balance.balance)}
                                sx={{ fontWeight: 500 }}
                            >
                                {formatBalance(balance.balance)}
                            </Typography>

                            <Chip
                                label={getBalanceText(balance.balance)}
                                size="small"
                                color={getBalanceColor(balance.balance)}
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            {balance && (
                <Box sx={{ ml: 6, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Total paid: {getCurrencySymbol(currency)}{balance.totalPaid.toFixed(2)} |
                        Total owed: {getCurrencySymbol(currency)}{balance.totalOwed.toFixed(2)}
                    </Typography>
                </Box>
            )}

            <Divider sx={{ mt: 1 }} />
        </Box>
    );
};

export default UserDisplay;
