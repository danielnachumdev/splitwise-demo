import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Box,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import type { User, UserBalance } from '../../../database';
import './MemberPreview.css';

interface MemberPreviewProps {
    user: User;
    balance: UserBalance | null;
    currency: string;
    onClick: (user: User) => void;
}

const MemberPreview: React.FC<MemberPreviewProps> = ({ user, balance, currency, onClick }) => {
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

    const balanceAmount = balance?.balance || 0;

    return (
        <Card onClick={() => onClick(user)} className="member-preview">
            <CardContent className="member-preview-content">
                <Box className="member-preview-header">
                    <Avatar className="member-preview-avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box className="member-preview-info">
                        <Typography variant="subtitle1" className="member-preview-name">
                            {user.name}
                        </Typography>
                        {balance && (
                            <Typography
                                variant="h6"
                                className={`member-preview-balance ${balanceAmount > 0 ? 'positive' : balanceAmount < 0 ? 'negative' : 'neutral'}`}
                            >
                                {formatBalance(balanceAmount)}
                            </Typography>
                        )}
                    </Box>
                    <ArrowForward className="member-preview-arrow" />
                </Box>

                {balance && (
                    <Box className="member-preview-footer">
                        <Chip
                            label={getBalanceText(balanceAmount)}
                            size="small"
                            color={getBalanceColor(balanceAmount)}
                            variant="outlined"
                            className="member-preview-status-chip"
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default MemberPreview;
