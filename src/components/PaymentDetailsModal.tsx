import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Grid,
} from '@mui/material';
import { Close as CloseIcon, Person as PersonIcon, CheckCircle as CheckCircleIcon, Pending as PendingIcon } from '@mui/icons-material';
import type { Payment, PaymentParticipant, User } from '../types';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  participants: PaymentParticipant[];
  users: User[];
  currency: string;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number): string => {
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
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

  const totalParticipants = participantUsers.length;
  const paidParticipants = participantUsers.filter(p => p.isPaid).length;
  const pendingParticipants = totalParticipants - paidParticipants;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {payment.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={payment.category ? payment.category.charAt(0).toUpperCase() + payment.category.slice(1) : 'No Category'}
                size="small"
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(payment.date)}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Payment Summary */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatAmount(payment.amount)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Amount
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: 1, mb: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {totalParticipants} {totalParticipants === 1 ? 'Person' : 'People'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${paidParticipants} Paid`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<PendingIcon />}
                    label={`${pendingParticipants} Pending`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Payer Information */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.50' }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
            Paid By
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, fontSize: '1.5rem' }}>
              {paidByUser?.name.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {paidByUser?.name || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paidByUser?.email || 'No email available'}
              </Typography>
            </Box>
            <Chip
              label="Fully Paid"
              color="success"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          </Box>
        </Paper>

        {/* Participants Breakdown */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
            Split Between Participants
          </Typography>
          
          {participantUsers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No participants found for this payment.
              </Typography>
            </Box>
          ) : (
            <List>
              {participantUsers.map(({ user, share, isPaid }, index) => (
                <React.Fragment key={user.id}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: isPaid ? 'success.main' : 'warning.main',
                        width: 40, 
                        height: 40,
                        fontSize: '1rem'
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {formatAmount(share)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={isPaid ? 'Paid' : 'Pending'}
                            size="small"
                            color={isPaid ? 'success' : 'warning'}
                            variant="outlined"
                          />
                          {isPaid && (
                            <Typography variant="caption" color="success.main">
                              ✓ Payment received
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < participantUsers.length - 1 && (
                    <Divider sx={{ mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Payment Notes */}
        {payment.description && (
          <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
              Payment Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {payment.description}
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDetailsModal;
