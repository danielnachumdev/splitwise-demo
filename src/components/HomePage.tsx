import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Paper,
    AppBar,
    Toolbar,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Add as AddIcon, Group as GroupIcon } from '@mui/icons-material';
import type { Group, User } from '../types';
import { userService, groupService, demoDataService } from '../services';
import CreateGroupModal from './CreateGroupModal';
import GroupCard from './GroupCard';

// For demo purposes, we'll use a hardcoded user ID
// In a real app, this would come from authentication
const DEMO_USER_ID = 'demo-user-123';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Services are imported directly

    useEffect(() => {
        initializeDemoUser();
        loadGroups();
        initializeDemoData();
    }, []);

    const initializeDemoUser = async () => {
        try {
            // Check if demo user exists, if not create one
            let user = await userService.getUserById(DEMO_USER_ID);
            if (!user) {
                user = await userService.createUser({
                    name: 'Demo User',
                    email: 'demo@example.com',
                });
            }
            setCurrentUser(user);
        } catch (error) {
            setError('Failed to initialize demo user');
            console.error('Error initializing demo user:', error);
        }
    };

    const initializeDemoData = async () => {
        try {
            await demoDataService.initializeDemoData();
            // Refresh groups after demo data is initialized
            await loadGroups();
        } catch (error) {
            console.error('Error initializing demo data:', error);
        }
    };

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

    const handleCreateGroup = async (groupData: {
        name: string;
        description: string;
        currency: string;
    }) => {
        try {
            // Create the group
            const newGroup = await groupService.createGroup({
                ...groupData,
                createdBy: DEMO_USER_ID,
            });

            // Add the current user to the group as admin
            await groupService.addUserToGroup(DEMO_USER_ID, newGroup.id, 'admin');

            // Refresh the groups list
            await loadGroups();
            setShowCreateModal(false);
        } catch (error) {
            setError('Failed to create group');
            console.error('Error creating group:', error);
        }
    };

    const handleGroupClick = (group: Group) => {
        navigate(`/group/${group.id}`);
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
                        Loading groups...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Header */}
            <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Splitwise Demo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage your group expenses
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Welcome, {currentUser?.name}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Create Group Button */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => setShowCreateModal(true)}
                        sx={{ px: 3, py: 1.5 }}
                    >
                        Create New Group
                    </Button>
                </Box>

                {/* Groups Section */}
                <Box>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                        Your Groups
                    </Typography>

                    {groups.length === 0 ? (
                        <Paper
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                bgcolor: 'white',
                            }}
                        >
                            <GroupIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                                No groups yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Get started by creating your first group to manage shared expenses.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create Group
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {groups.map((group) => (
                                <Grid item xs={12} sm={6} lg={4} key={group.id}>
                                    <GroupCard
                                        group={group}
                                        onClick={() => handleGroupClick(group)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Container>

            {/* Create Group Modal */}
            {showCreateModal && (
                <CreateGroupModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreateGroup={handleCreateGroup}
                />
            )}
        </Box>
    );
};

export default HomePage;
