import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import type { Group, User, Payment, PaymentParticipant, UserBalance } from '../types';
import localStorageService from '../services/localStorageService';
import PaymentStatement from './PaymentStatement';
import UserDisplay from './UserDisplay';
import AddDataModal from './AddDataModal';
import DebtBreakdown from './DebtBreakdown';

const GroupDetailsPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [group, setGroup] = useState<Group | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentParticipants, setPaymentParticipants] = useState<PaymentParticipant[]>([]);
    const [userBalances, setUserBalances] = useState<UserBalance[]>([]);
    const [debtBreakdown, setDebtBreakdown] = useState<Array<{
        fromUserId: string;
        toUserId: string;
        amount: number;
        description: string;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddDataModal, setShowAddDataModal] = useState(false);

    useEffect(() => {
        if (groupId) {
            loadGroupData();
        }
    }, [groupId]);

    const loadGroupData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load group details
            const groupData = await localStorageService.getGroupById(groupId!);
            if (!groupData) {
                setError('Group not found');
                return;
            }
            setGroup(groupData);

            // Load group members
            const userGroups = await localStorageService.getUserGroups();
            const memberIds = userGroups
                .filter(ug => ug.groupId === groupId && ug.isActive)
                .map(ug => ug.userId);

            const allUsers = await localStorageService.getUsers();
            const groupUsers = allUsers.filter(user => memberIds.includes(user.id));
            setUsers(groupUsers);

            // Load payments
            const groupPayments = await localStorageService.getPaymentsByGroupId(groupId!);
            setPayments(groupPayments);

            // Load payment participants
            const allParticipants = await localStorageService.getPaymentParticipants();
            const groupParticipants = allParticipants.filter(pp =>
                groupPayments.some(payment => payment.id === pp.paymentId)
            );
            setPaymentParticipants(groupParticipants);

            // Load user balances
            const balances = await localStorageService.getUserBalances();
            const groupBalances = balances.filter(balance => balance.groupId === groupId);
            setUserBalances(groupBalances);

            // Load debt breakdown
            const debtData = await localStorageService.getGroupDebtBreakdown(groupId!);
            setDebtBreakdown(debtData);

        } catch (error) {
            setError('Failed to load group data');
            console.error('Error loading group data:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const getUserBalance = (userId: string): UserBalance | null => {
        return userBalances.find(balance => balance.userId === userId) || null;
    };

    const getPaymentParticipants = (paymentId: string): PaymentParticipant[] => {
        return paymentParticipants.filter(pp => pp.paymentId === paymentId);
    };

    const handleAddData = () => {
        setShowAddDataModal(true);
    };

    const handleDataAdded = async () => {
        // Refresh all data after adding new data
        await loadGroupData();
        setShowAddDataModal(false);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.50',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={48} sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                        Loading group details...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error || !group) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Group not found'}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Header */}
            <Paper elevation={1} sx={{ mb: 3 }}>
                <Container maxWidth="lg">
                    <Box sx={{ py: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate('/')}
                            >
                                Back to Groups
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddData}
                            >
                                Add Data
                            </Button>
                        </Box>

                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {group.name}
                        </Typography>

                        {group.description && (
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                {group.description}
                            </Typography>
                        )}

                        <Chip
                            label={`${getCurrencySymbol(group.currency)} ${group.currency}`}
                            color="primary"
                            variant="outlined"
                        />
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {/* Group Members Section */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                Group Members ({users.length})
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                {users.map((user) => {
                                    const balance = getUserBalance(user.id);
                                    return (
                                        <UserDisplay
                                            key={user.id}
                                            user={user}
                                            balance={balance}
                                            currency={group.currency}
                                        />
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Main Content Section */}
                    <Grid item xs={12} md={8}>
                        {/* Debt Breakdown Section */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                Settlement Summary
                            </Typography>
                            <DebtBreakdown
                                debtBreakdown={debtBreakdown}
                                users={users}
                                currency={group.currency}
                            />
                        </Paper>

                        {/* Payments Section */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                Payment History ({payments.length})
                            </Typography>

                            {payments.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No payments yet. Start adding expenses to see them here.
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    {payments.map((payment) => (
                                        <PaymentStatement
                                            key={payment.id}
                                            payment={payment}
                                            participants={getPaymentParticipants(payment.id)}
                                            users={users}
                                            currency={group.currency}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Add Data Modal */}
            {showAddDataModal && (
                <AddDataModal
                    isOpen={showAddDataModal}
                    onClose={() => setShowAddDataModal(false)}
                    onDataAdded={handleDataAdded}
                    group={group}
                    existingUsers={users}
                />
            )}
        </Box>
    );
};

export default GroupDetailsPage;
