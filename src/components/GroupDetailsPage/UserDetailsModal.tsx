import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
} from '@mui/material';
import { Close as CloseIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import type { User, UserBalance, Payment, PaymentParticipant } from '../../database';
import { formatDate, getCurrencySymbol } from '../../utils';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  balance: UserBalance | null;
  payments: Payment[];
  paymentParticipants: PaymentParticipant[];
  currency: string;
  users: User[]; // Added users prop
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  balance,
  payments,
  paymentParticipants,
  currency,
  users, // Destructure users
}) => {

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

  const formatAmount = (amount: number): string => {
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
  };



  // Get payments made by this user
  const paymentsMade = payments.filter(p => p.paidBy === user.id);

  // Get payments this user participated in
  const userParticipationsForCurrent = paymentParticipants.filter(pp => {
    const payment = payments.find(p => p.id === pp.paymentId);
    return payment && pp.userId === user.id;
  });
  const userParticipationsByCurrent = paymentParticipants.filter(pp => {
    const payment = payments.find(p => p.id === pp.paymentId);
    return payment && payment?.paidBy == user.id;
  });
  // Get debts owed to this user (payments they made for others)
  const debtsOwedToUser = userParticipationsByCurrent
    .filter(pp => {
      const payment = payments.find(p => p.id === pp.paymentId);
      // Only include if this user made the payment (they're the payer)
      return payment && payment.paidBy === user.id && pp.userId !== user.id;
    })
    .map(pp => {
      const payment = payments.find(p => p.id === pp.paymentId)!;
      return {
        payment,
        share: pp.share,
        isPaid: pp.isPaid,
        debtorId: pp.userId, // The person who owes money
      };
    });
  // Get debts this user owes (payments others made for them)
  const debtsUserOwes = userParticipationsForCurrent
    .filter(pp => {
      const payment = payments.find(p => p.id === pp.paymentId);
      // Only include if someone else made the payment (they're not the payer)
      return payment && payment.paidBy !== user.id;
    })
    .map(pp => {
      const payment = payments.find(p => p.id === pp.paymentId)!;
      return {
        payment,
        share: pp.share,
        isPaid: pp.isPaid,
        creditorId: payment.paidBy, // The person who paid on their behalf
      };
    });

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
          <Avatar sx={{ width: 48, height: 48, fontSize: '1.5rem' }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
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
        {/* Balance Summary */}
        {balance && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
              Financial Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatAmount(balance.balance)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net Balance
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {formatAmount(balance.totalPaid)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Paid
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {formatAmount(balance.totalOwed)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Owed
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Chip
                label={getBalanceText(balance.balance)}
                color={getBalanceColor(balance.balance)}
                variant="outlined"
                size="medium"
              />
            </Box>
          </Paper>
        )}

        {/* Payments Made */}
        {paymentsMade.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
              Payments Made ({paymentsMade.length})
            </Typography>
            <List dense>
              {paymentsMade.map((payment) => (
                <ListItem key={payment.id} sx={{ bgcolor: 'success.50', mb: 1, borderRadius: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                      {getCurrencySymbol(currency)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={payment.description}
                    secondary={`${formatDate(payment.date)} • ${payment.category || 'No category'}`}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {formatAmount(payment.amount)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Debts Owed to User */}
        {debtsOwedToUser.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
              Money Owed to {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user.name} paid for these expenses and others owe them money:
            </Typography>
            <List dense>
              {debtsOwedToUser.map(({ payment, share, isPaid, debtorId }) => {
                const debtor = users.find(u => u.id === debtorId);
                return (
                  <ListItem key={`${payment.id}-${debtorId}`} sx={{ bgcolor: 'success.50', mb: 1, borderRadius: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                        {payment.description.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${payment.description}, ${formatAmount(share)}, ${debtor?.name || 'Unknown User'}`}
                      secondary={`${formatDate(payment.date)} • ${payment.category || 'No category'}`}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatAmount(share)} / {formatAmount(payment.amount)} (%{share / payment.amount * 100})
                      </Typography>
                      <Chip
                        label={isPaid ? 'Paid' : 'Pending'}
                        size="small"
                        color={isPaid ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}

        {/* Debts User Owes */}
        {debtsUserOwes.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'error.main' }}>
              Money {user.name} Owes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Others paid for these expenses on {user.name}'s behalf:
            </Typography>
            <List dense>
              {debtsUserOwes.map(({ payment, share, isPaid, creditorId }) => {
                const creditor = users.find(u => u.id === creditorId);
                return (
                  <ListItem key={`${payment.id}-${creditorId}`} sx={{ bgcolor: 'error.50', mb: 1, borderRadius: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                        {payment.description.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={payment.description}
                      secondary={`Paid by ${creditor?.name || 'Unknown User'} • ${formatDate(payment.date)}`}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        {formatAmount(share)} / {formatAmount(payment.amount)} (%{share / payment.amount * 100})
                      </Typography>
                      <Chip
                        label={isPaid ? 'Paid' : 'Pending'}
                        size="small"
                        color={isPaid ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}

        {paymentsMade.length === 0 && debtsOwedToUser.length === 0 && debtsUserOwes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No payment activity for this user yet.
            </Typography>
          </Box>
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

export default UserDetailsModal;
