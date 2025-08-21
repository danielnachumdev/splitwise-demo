import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import type { Payment, User } from '../../database';

interface PaymentCardProps {
  payment: Payment;
  paidByUser: User | undefined;
  currency: string;
  onClick: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, paidByUser, currency, onClick }) => {
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
      month: 'short',
      day: 'numeric',
    });
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
        {/* Payment Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
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

          <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {getCurrencySymbol(currency)}{payment.amount.toFixed(2)}
          </Typography>
        </Box>

        {/* Category and Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {payment.category && (
            <Chip
              label={payment.category.charAt(0).toUpperCase() + payment.category.slice(1)}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
              {paidByUser?.name.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              Click for details
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
