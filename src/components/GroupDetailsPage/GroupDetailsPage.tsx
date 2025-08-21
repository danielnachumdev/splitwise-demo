import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import type { Group, User, Payment, PaymentParticipant, UserBalance } from '../../database';
import { groupService, userService, paymentService, balanceService } from '../../services';
import { MembersPanel } from './MembersPanel';
import { PaymentsPanel } from './PaymentsPanel';
import { AddDataModal } from './AddDataModal';
import { PageHeader } from './PageHeader';
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

    const handleAddData = () => {
        setShowAddDataModal(true);
    };

    const handleDataAdded = async () => {
        await loadGroupData();
        setShowAddDataModal(false);
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
    };

    const handlePaymentClick = (payment: Payment) => {
        setSelectedPayment(payment);
    };

    const handleCloseUserModal = () => {
        setSelectedUser(null);
    };

    const handleClosePaymentModal = () => {
        setSelectedPayment(null);
    };

    const handleBackClick = () => {
        navigate('/');
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
            <PageHeader
                group={group}
                onBackClick={handleBackClick}
                onAddDataClick={handleAddData}
            />

            <Box className="group-details-content">
                {/* Left Sidebar - Users */}
                <Box className="group-details-sidebar">
                    <MembersPanel
                        users={users}
                        userBalances={userBalances}
                        currency={group.currency}
                        onUserClick={handleUserClick}
                    />
                </Box>

                {/* Main Content Section */}
                <Box className="group-details-main">
                    <PaymentsPanel
                        payments={payments}
                        users={users}
                        currency={group.currency}
                        onPaymentClick={handlePaymentClick}
                    />
                </Box>
            </Box>

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
                    balance={userBalances.find(b => b.userId === selectedUser.id) || null}
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
                    participants={paymentParticipants.filter(pp => pp.paymentId === selectedPayment.id)}
                    users={users}
                    currency={group.currency}
                />
            )}
        </Box>
    );
};

export default GroupDetailsPage;
