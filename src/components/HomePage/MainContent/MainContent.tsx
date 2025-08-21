import React from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Alert,
} from '@mui/material';
import { Add as AddIcon, Group as GroupIcon } from '@mui/icons-material';
import type { Group } from '../../../database';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupCard } from './GroupCard';

interface MainContentProps {
    error: string | null;
    groups: Group[];
    onGroupClick: (group: Group) => void;
    onCreateGroup: (groupData: { name: string; description: string; currency: string }) => Promise<void>;
}

const MainContent: React.FC<MainContentProps> = ({
    error,
    groups,
    onGroupClick,
    onCreateGroup,
}) => {
    const [showCreateModal, setShowCreateModal] = React.useState(false);

    const handleCreateModalOpen = () => setShowCreateModal(true);
    const handleCreateModalClose = () => setShowCreateModal(false);

    const handleCreateGroup = async (groupData: { name: string; description: string; currency: string }) => {
        await onCreateGroup(groupData);
        setShowCreateModal(false);
    };

    return (
        <Box sx={{ flex: 1, overflow: 'auto', p: 4 }}>
            <Container maxWidth="lg" sx={{ height: '100%' }}>
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
                        onClick={handleCreateModalOpen}
                        sx={{ px: 3, py: 1.5 }}
                    >
                        Create New Group
                    </Button>
                </Box>

                {/* Groups Section */}
                <Box sx={{ height: 'calc(100% - 120px)' }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                        Your Groups
                    </Typography>

                    {groups.length === 0 ? (
                        <Paper
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                bgcolor: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
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
                                onClick={handleCreateModalOpen}
                            >
                                Create Group
                            </Button>
                        </Paper>
                    ) : (
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                            gap: 3,
                            height: '100%'
                        }}>
                            {groups.map((group) => (
                                <Box key={group.id}>
                                    <GroupCard
                                        group={group}
                                        onClick={() => onGroupClick(group)}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={handleCreateModalClose}
                onCreateGroup={handleCreateGroup}
            />
        </Box>
    );
};

export default MainContent;
