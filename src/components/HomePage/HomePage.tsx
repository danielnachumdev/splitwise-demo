import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { Group } from '../../database';
import { groupService, paymentService } from '../../services';
import HomeHeader from './HomeHeader';
import { MainContent } from './MainContent';
import './HomePage.css';

// For demo purposes, we'll use a hardcoded user ID
// In a real app, this would come from authentication
const DEMO_USER_ID = 'demo-user-123';

const HomePage: React.FC = () => {
    // 1. HOOKS & STATE (top)
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. EFFECTS (after state)
    useEffect(() => {
        loadGroups();
    }, []);

    // 3. EVENT HANDLERS (after effects)
    const handleCreateGroup = async (groupData: {
        name: string;
        description: string;
        currency: string;
    }) => {
        try {
            const newGroup = await groupService.createGroup({
                ...groupData,
                createdBy: DEMO_USER_ID,
            });

            await groupService.addUserToGroup(DEMO_USER_ID, newGroup.id, 'admin');
            await loadGroups();
        } catch (error) {
            setError('Failed to create group');
            console.error('Error creating group:', error);
        }
    };

    const handleGroupClick = (group: Group) => {
        navigate(`/group/${group.id}`);
    };

    const handleDeleteGroup = async (groupId: string) => {
        try {
            // Get all payments for this group
            const groupPayments = await paymentService.getPaymentsByGroupId(groupId);

            // Delete all payments and their participants
            for (const payment of groupPayments) {
                // Note: In a real app, you might want to delete payment participants first
                // depending on your database constraints
                await paymentService.deletePayment(payment.id);
            }

            // Remove all users from the group
            await groupService.removeUserFromGroup(DEMO_USER_ID, groupId);

            // Delete the group itself
            await groupService.deleteGroup(groupId);

            // Reload groups to update the UI
            await loadGroups();
        } catch (error) {
            setError('Failed to delete group');
            console.error('Error deleting group:', error);
        }
    };

    // 4. HELPER FUNCTIONS (after handlers)
    const loadGroups = async () => {
        try {
            setLoading(true);
            setError(null);
            const userGroups = await groupService.getGroupsByUserId(DEMO_USER_ID);
            setGroups(userGroups);
        } catch (error) {
            setError('Failed to load groups');
            console.error('Error loading groups:', error);
        } finally {
            setLoading(false);
        }
    };

    // 5. RENDER LOGIC (at the bottom)
    if (loading) {
        return (
            <Box className="loading-container">
                <Box className="loading-content">
                    <CircularProgress size={48} className="loading-spinner" />
                    <Typography variant="body1" color="text.secondary">
                        Loading groups...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="home-page-container">
            <HomeHeader />
            <MainContent
                error={error}
                groups={groups}
                onGroupClick={handleGroupClick}
                onCreateGroup={handleCreateGroup}
                onDeleteGroup={handleDeleteGroup}
            />
        </Box>
    );
};

export default HomePage;
