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
    Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import type { Group, User, Payment, PaymentParticipant, UserBalance } from '../../database';
import { groupService, userService, paymentService, balanceService } from '../../services';
import UserCard from './UserCard';
import PaymentCard from './PaymentCard';
import { AddDataModal } from './AddDataModal';
import UserDetailsModal from './UserDetailsModal';
import PaymentDetailsModal from './PaymentDetailsModal';
import './GroupDetailsPage.css';

const GroupDetailsPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [group, setGroup] = useState<Group | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentParticipants, setPaymentParticipants] = useState<PaymentParticipant[]>([]);
    const [userBalances, setUserBalances] = useState<UserBalance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddDataModal, setShowAddDataModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

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
            const groupData = await groupService.getGroupById(groupId!);
            if (!groupData) {
                setError('Group not found');
                return;
            }
            setGroup(groupData);

            // Load group members
            const userGroups = await groupService.getUserGroups();
            const memberIds = userGroups
                .filter(ug => ug.groupId === groupId && ug.isActive)
                .map(ug => ug.userId);

            const allUsers = await userService.getUsers();
            const groupUsers = allUsers.filter(user => memberIds.includes(user.id));
            setUsers(groupUsers);

            // Load payments
            const groupPayments = await paymentService.getPaymentsByGroupId(groupId!);
            setPayments(groupPayments);

            // Load payment participants
            const allParticipants = await paymentService.getPaymentParticipants();
            const groupParticipants = allParticipants.filter(pp =>
                groupPayments.some(payment => payment.id === pp.paymentId)
            );
            setPaymentParticipants(groupParticipants);

            // Load user balances
            const balances = await balanceService.getUserBalances();
            const groupBalances = balances.filter(balance => balance.groupId === groupId);
            setUserBalances(groupBalances);

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
        await loadGroupData();
        setShowAddDataModal(false);
    };

    const handleUserCardClick = (user: User) => {
        setSelectedUser(user);
    };

    const handlePaymentCardClick = (payment: Payment) => {
        setSelectedPayment(payment);
    };

    const handleCloseUserModal = () => {
        setSelectedUser(null);
    };

    const handleClosePaymentModal = () => {
        setSelectedPayment(null);
    };

    if (loading) {
        return (
            <Box className="group-details-loading">
                <Box className="group-details-loading-content">
                    <CircularProgress size={48} className="group-details-loading-spinner" />
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
        <Box className="group-details-page">
            {/* Header */}
            <Paper elevation={1} className="group-details-header">
                <Container maxWidth="lg">
                    <Box className="group-details-header-content">
                        <Box className="group-details-header-actions">
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

                        <Typography variant="h4" component="h1" className="group-details-title">
                            {group.name}
                        </Typography>

                        {group.description && (
                            <Typography variant="body1" className="group-details-description">
                                {group.description}
                            </Typography>
                        )}

                        <Chip
                            label={`${getCurrencySymbol(group.currency)} ${group.currency}`}
                            color="primary"
                            variant="outlined"
                            className="group-details-currency-chip"
                        />
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {/* Left Sidebar - Users */}
                    <Grid item xs={12} md={4}>
                        <Paper className="group-details-sidebar-content">
                            <Typography variant="h6" component="h2" className="group-details-sidebar-title">
                                Group Members ({users.length})
                            </Typography>

                            <Grid container spacing={2}>
                                {users.map((user) => {
                                    const balance = getUserBalance(user.id);
                                    return (
                                        <Grid item xs={12} key={user.id}>
                                            <UserCard
                                                user={user}
                                                balance={balance}
                                                currency={group.currency}
                                                onClick={() => handleUserCardClick(user)}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Main Content Section */}
                    <Grid item xs={12} md={8}>
                        {/* Payments Section */}
                        <Paper className="group-details-main-content">
                            <Typography variant="h6" component="h2" className="group-details-main-title">
                                Payment History ({payments.length})
                            </Typography>

                            {payments.length === 0 ? (
                                <Box className="group-details-empty-state">
                                    <Typography variant="body2" className="group-details-empty-text">
                                        No payments yet. Start adding expenses to see them here.
                                    </Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {payments.map((payment) => {
                                        const paidByUser = users.find(user => user.id === payment.paidBy);
                                        return (
                                            <Grid item xs={12} sm={6} key={payment.id}>
                                                <PaymentCard
                                                    payment={payment}
                                                    paidByUser={paidByUser}
                                                    currency={group.currency}
                                                    onClick={() => handlePaymentCardClick(payment)}
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
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

            {/* User Details Modal */}
            {selectedUser && (
                <UserDetailsModal
                    isOpen={!!selectedUser}
                    onClose={handleCloseUserModal}
                    user={selectedUser}
                    balance={getUserBalance(selectedUser.id)}
                    payments={payments}
                    paymentParticipants={paymentParticipants}
                    currency={group.currency}
                    users={users}
                />
            )}

            {/* Payment Details Modal */}
            {selectedPayment && (
                <PaymentDetailsModal
                    isOpen={!!selectedPayment}
                    onClose={handleClosePaymentModal}
                    payment={selectedPayment}
                    participants={getPaymentParticipants(selectedPayment.id)}
                    users={users}
                    currency={group.currency}
                />
            )}
        </Box>
    );
};

export default GroupDetailsPage;
