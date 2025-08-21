import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
} from '@mui/material';
import type { User, UserBalance } from '../../database';

interface UserCardProps {
  user: User;
  balance: UserBalance | null;
  currency: string;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, balance, currency, onClick }) => {
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
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2, fontSize: '1rem' }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {user.name}
            </Typography>
            {balance && (
              <Typography
                variant="h6"
                color={getBalanceColor(balance.balance)}
                sx={{ fontWeight: 'bold' }}
              >
                {formatBalance(balance.balance)}
              </Typography>
            )}
          </Box>
        </Box>

        {balance && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Chip
              label={getBalanceText(balance.balance)}
              size="small"
              color={getBalanceColor(balance.balance)}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
