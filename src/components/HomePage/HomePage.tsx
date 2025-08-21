import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { Group, User } from '../../database';
import { groupService } from '../../services';
import HomeHeader from './HomeHeader';
import { MainContent } from './MainContent';

// For demo purposes, we'll use a hardcoded user ID
// In a real app, this would come from authentication
const DEMO_USER_ID = 'demo-user-123';

const HomePage: React.FC = () => {
    // 1. HOOKS & STATE (top)
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser] = useState<User | null>(null);
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
                        Loading groups...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
            <HomeHeader currentUser={currentUser} />
            <MainContent
                error={error}
                groups={groups}
                onGroupClick={handleGroupClick}
                onCreateGroup={handleCreateGroup}
            />
        </Box>
    );
};

export default HomePage;
