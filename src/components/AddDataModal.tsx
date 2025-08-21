import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Tabs,
    Tab,
    Chip,
    Checkbox,
    FormControlLabel,
    Divider,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, Payment as PaymentIcon } from '@mui/icons-material';
import type { Group, User, PaymentCategory } from '../types';
import localStorageService from '../services/localStorageService';

interface AddDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDataAdded: () => void;
    group: Group;
    existingUsers: User[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`add-data-tabpanel-${index}`}
            aria-labelledby={`add-data-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
            const newUser = await localStorageService.createUser({
                name: userForm.name.trim(),
                email: userForm.email.trim(),
            });

            // Add user to group
            await localStorageService.addUserToGroup(newUser.id, group.id, 'member');

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
            const newPayment = await localStorageService.createPayment({
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

            await localStorageService.createPaymentParticipants(participants);

            // Recalculate user balances
            await localStorageService.recalculateGroupBalances(group.id);

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
                sx: { borderRadius: 2 },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AddIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                        Add Data to {group.name}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
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
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Add a new user to this group
                    </Typography>

                    <TextField
                        fullWidth
                        label="Name"
                        value={userForm.name}
                        onChange={(e) => handleUserFormChange('name', e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Enter user's full name"
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => handleUserFormChange('email', e.target.value)}
                        placeholder="Enter user's email address"
                    />
                </TabPanel>

                {/* Add Payment Tab */}
                <TabPanel value={activeTab} index={1}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Create a new payment statement
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={paymentForm.description}
                                onChange={(e) => handlePaymentFormChange('description', e.target.value)}
                                sx={{ mb: 2 }}
                                placeholder="e.g., Grocery shopping, Dinner, etc."
                            />

                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={paymentForm.amount}
                                onChange={(e) => handlePaymentFormChange('amount', e.target.value)}
                                sx={{ mb: 2 }}
                                placeholder="0.00"
                                inputProps={{ step: "0.01", min: "0" }}
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={paymentForm.category}
                                    label="Category"
                                    onChange={(e) => handlePaymentFormChange('category', e.target.value)}
                                >
                                    {paymentCategories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Paid By</InputLabel>
                                <Select
                                    value={paymentForm.paidBy}
                                    label="Paid By"
                                    onChange={(e) => handlePaymentFormChange('paidBy', e.target.value)}
                                >
                                    {existingUsers.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                Select Participants & Set Shares
                            </Typography>

                            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                {existingUsers.map((user) => (
                                    <Box key={user.id} sx={{ mb: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={paymentForm.participants.includes(user.id)}
                                                    onChange={() => handleParticipantToggle(user.id)}
                                                />
                                            }
                                            label={user.name}
                                        />

                                        {paymentForm.participants.includes(user.id) && (
                                            <TextField
                                                size="small"
                                                label="Share Amount"
                                                type="number"
                                                value={paymentForm.participantShares[user.id] || ''}
                                                onChange={(e) => handleShareChange(user.id, e.target.value)}
                                                sx={{ ml: 4, width: 120 }}
                                                placeholder="0.00"
                                                inputProps={{ step: "0.01", min: "0" }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            {paymentForm.participants.length > 0 && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Total shares: {paymentForm.participants.reduce((sum, userId) =>
                                            sum + parseFloat(paymentForm.participantShares[userId] || '0'), 0
                                        ).toFixed(2)}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </TabPanel>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
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
