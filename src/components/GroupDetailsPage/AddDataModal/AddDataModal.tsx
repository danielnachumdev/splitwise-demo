import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, Payment as PaymentIcon } from '@mui/icons-material';
import type { Group, User, PaymentCategory } from '../../../database';
import { userService, groupService, paymentService, balanceService } from '../../../services';
import TabPanel from './TabPanel';
import UserForm from './UserForm';
import PaymentForm from './PaymentForm';
import './AddDataModal.css';

interface AddDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDataAdded: () => void;
    group: Group;
    existingUsers: User[];
}

const AddDataModal: React.FC<AddDataModalProps> = ({
    isOpen,
    onClose,
    onDataAdded,
    group,
    existingUsers,
}) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // User form state
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
    });

    // Payment form state
    const [paymentForm, setPaymentForm] = useState({
        description: '',
        amount: '',
        category: 'food' as PaymentCategory,
        paidBy: '',
        participants: [] as string[],
        participantShares: {} as Record<string, string>,
    });

    const paymentCategories: PaymentCategory[] = [
        'food',
        'transport',
        'entertainment',
        'utilities',
        'rent',
        'shopping',
        'other',
    ];

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleUserFormChange = (field: string, value: string) => {
        setUserForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentFormChange = (field: string, value: any) => {
        setPaymentForm(prev => ({ ...prev, [field]: value }));
    };

    const handleParticipantToggle = (userId: string) => {
        setPaymentForm(prev => {
            const newParticipants = prev.participants.includes(userId)
                ? prev.participants.filter(id => id !== userId)
                : [...prev.participants, userId];

            // Update participant shares
            const newShares = { ...prev.participantShares };
            if (newParticipants.includes(userId)) {
                newShares[userId] = '';
            } else {
                delete newShares[userId];
            }

            return {
                ...prev,
                participants: newParticipants,
                participantShares: newShares,
            };
        });
    };

    const handleShareChange = (userId: string, share: string) => {
        setPaymentForm(prev => ({
            ...prev,
            participantShares: {
                ...prev.participantShares,
                [userId]: share,
            },
        }));
    };

    const validateUserForm = (): boolean => {
        if (!userForm.name.trim() || !userForm.email.trim()) {
            setError('Name and email are required');
            return false;
        }
        return true;
    };

    const validatePaymentForm = (): boolean => {
        if (!paymentForm.description.trim() || !paymentForm.amount || !paymentForm.paidBy) {
            setError('Description, amount, and payer are required');
            return false;
        }

        if (paymentForm.participants.length === 0) {
            setError('At least one participant is required');
            return false;
        }

        const amount = parseFloat(paymentForm.amount);
        if (isNaN(amount) || amount <= 0) {
            setError('Amount must be a positive number');
            return false;
        }

        // Check if all participants have shares
        const totalShare = paymentForm.participants.reduce((sum, userId) => {
            const share = parseFloat(paymentForm.participantShares[userId] || '0');
            return sum + share;
        }, 0);

        if (Math.abs(totalShare - amount) > 0.01) {
            setError(`Total shares (${totalShare.toFixed(2)}) must equal the payment amount (${amount.toFixed(2)})`);
            return false;
        }

        return true;
    };

    const handleAddUser = async () => {
        if (!validateUserForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Create new user
            const newUser = await userService.createUser({
                name: userForm.name.trim(),
                email: userForm.email.trim(),
            });

            // Add user to group
            await groupService.addUserToGroup(newUser.id, group.id, 'member');

            // Reset form
            setUserForm({ name: '', email: '' });

            // Notify parent component
            onDataAdded();
        } catch (error) {
            setError('Failed to add user');
            console.error('Error adding user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddPayment = async () => {
        if (!validatePaymentForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const amount = parseFloat(paymentForm.amount);

            // Create payment
            const newPayment = await paymentService.createPayment({
                groupId: group.id,
                paidBy: paymentForm.paidBy,
                amount,
                description: paymentForm.description.trim(),
                category: paymentForm.category,
                date: new Date(),
            });

            // Create payment participants
            const participants = paymentForm.participants.map(userId => ({
                paymentId: newPayment.id,
                userId,
                share: parseFloat(paymentForm.participantShares[userId]),
                isPaid: userId === paymentForm.paidBy, // Payer is automatically marked as paid
            }));

            await paymentService.createPaymentParticipants(participants);

            // Recalculate user balances and debt breakdown
            await balanceService.recalculateGroupBalances(group.id);

            // Reset form
            setPaymentForm({
                description: '',
                amount: '',
                category: 'food',
                paidBy: '',
                participants: [],
                participantShares: {},
            });

            // Notify parent component
            onDataAdded();
        } catch (error) {
            setError('Failed to add payment');
            console.error('Error adding payment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            // Reset forms
            setUserForm({ name: '', email: '' });
            setPaymentForm({
                description: '',
                amount: '',
                category: 'food',
                paidBy: '',
                participants: [],
                participantShares: {},
            });
            setError(null);
            setActiveTab(0);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: "add-data-modal-dialog"
            }}
        >
            <DialogTitle>
                <Box className="add-data-modal-title">
                    <AddIcon className="add-data-modal-title-icon" />
                    <Typography variant="h6" component="h2">
                        Add Data to {group.name}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent className="add-data-modal-content">
                {error && (
                    <Alert severity="error" className="add-data-modal-error">
                        {error}
                    </Alert>
                )}

                <Tabs value={activeTab} onChange={handleTabChange} className="add-data-modal-tabs">
                    <Tab
                        icon={<PersonIcon />}
                        label="Add User"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<PaymentIcon />}
                        label="Add Payment"
                        iconPosition="start"
                    />
                </Tabs>

                {/* Add User Tab */}
                <TabPanel value={activeTab} index={0}>
                    <UserForm
                        userForm={userForm}
                        onFormChange={handleUserFormChange}
                    />
                </TabPanel>

                {/* Add Payment Tab */}
                <TabPanel value={activeTab} index={1}>
                    <PaymentForm
                        paymentForm={paymentForm}
                        existingUsers={existingUsers}
                        paymentCategories={paymentCategories}
                        onFormChange={handlePaymentFormChange}
                        onParticipantToggle={handleParticipantToggle}
                        onShareChange={handleShareChange}
                    />
                </TabPanel>
            </DialogContent>

            <DialogActions className="add-data-modal-actions">
                <Button onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={activeTab === 0 ? handleAddUser : handleAddPayment}
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={16} /> : <AddIcon />}
                >
                    {isSubmitting ? 'Adding...' : activeTab === 0 ? 'Add User' : 'Add Payment'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDataModal;
