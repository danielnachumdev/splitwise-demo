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
import './PaymentCard.css';

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
    <Card onClick={onClick} className="payment-card">
      <CardContent className="payment-card-content">
        {/* Payment Header */}
        <Box className="payment-card-header">
          <Box className="payment-card-info">
            <Typography variant="h6" component="h3" className="payment-card-description">
              {payment.description}
            </Typography>
            <Typography variant="body2" className="payment-card-payer">
              Paid by {paidByUser?.name || 'Unknown User'}
            </Typography>
            <Typography variant="caption" className="payment-card-date">
              {formatDate(payment.date)}
            </Typography>
          </Box>
          <Typography variant="h5" component="span" className="payment-card-amount">
            {getCurrencySymbol(currency)}{payment.amount.toFixed(2)}
          </Typography>
        </Box>

        {/* Category and Status */}
        <Box className="payment-card-footer">
          {payment.category && (
            <Chip
              label={payment.category.charAt(0).toUpperCase() + payment.category.slice(1)}
              size="small"
              variant="outlined"
              className="payment-card-category"
            />
          )}

          <Box className="payment-card-actions">
            <Avatar className="payment-card-avatar">
              {paidByUser?.name.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Typography variant="caption" className="payment-card-hint">
              Click for details
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
