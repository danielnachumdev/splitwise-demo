import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Avatar,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import type { Payment, User } from '../../../database';
import './PaymentPreview.css';
import { formatDate, getCurrencySymbol } from '../../../utils';

interface PaymentPreviewProps {
    payment: Payment;
    paidByUser: User | undefined;
    currency: string;
    onClick: (payment: Payment) => void;
}

const PaymentPreview: React.FC<PaymentPreviewProps> = ({ payment, paidByUser, currency, onClick }) => {

    return (
        <Card onClick={() => onClick(payment)} className="payment-preview">
            <CardContent className="payment-preview-content">
                {/* Payment Header */}
                <Box className="payment-preview-header">
                    <Box className="payment-preview-info">
                        <Typography variant="h6" component="h3" className="payment-preview-description">
                            {payment.description}
                        </Typography>
                        <Typography variant="body2" className="payment-preview-payer">
                            Paid by {paidByUser?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" className="payment-preview-date">
                            {formatDate(payment.date)}
                        </Typography>
                    </Box>
                    <Typography variant="h5" component="span" className="payment-preview-amount">
                        {getCurrencySymbol(currency)}{payment.amount.toFixed(2)}
                    </Typography>
                </Box>

                {/* Category and Status */}
                <Box className="payment-preview-footer">
                    <Box className="payment-preview-left">
                        {payment.category && (
                            <Chip
                                label={payment.category.charAt(0).toUpperCase() + payment.category.slice(1)}
                                size="small"
                                variant="outlined"
                                className="payment-preview-category"
                            />
                        )}
                        <Avatar className="payment-preview-avatar">
                            {paidByUser?.name.charAt(0).toUpperCase() || '?'}
                        </Avatar>
                    </Box>

                    <ArrowForward className="payment-preview-hint" />
                </Box>
            </CardContent>
        </Card>
    );
};

export default PaymentPreview;
