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
import './UserCard.css';

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

  const getBalanceClassName = (balanceAmount: number): string => {
    if (balanceAmount > 0) return 'user-card-balance user-card-balance-success';
    if (balanceAmount < 0) return 'user-card-balance user-card-balance-error';
    return 'user-card-balance user-card-balance-default';
  };

  return (
    <Card onClick={onClick} className="user-card">
      <CardContent className="user-card-content">
        <Box className="user-card-header">
          <Avatar className="user-card-avatar">
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box className="user-card-info">
            <Typography variant="subtitle1" className="user-card-name">
              {user.name}
            </Typography>
            {balance && (
              <Typography
                variant="h6"
                className={getBalanceClassName(balance.balance)}
              >
                {formatBalance(balance.balance)}
              </Typography>
            )}
          </Box>
        </Box>

        {balance && (
          <Box className="user-card-footer">
            <Chip
              label={getBalanceText(balance.balance)}
              size="small"
              color={getBalanceColor(balance.balance)}
              variant="outlined"
              className="user-card-status-chip"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
