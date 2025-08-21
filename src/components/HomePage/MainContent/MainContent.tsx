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
import './MainContent.css';

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
        <Box className="main-content-container">
            <Container maxWidth="lg" className="main-content-wrapper">
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Create Group Button */}
                <Box className="create-group-button-container">
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={handleCreateModalOpen}
                        className="create-group-button"
                    >
                        Create New Group
                    </Button>
                </Box>

                {/* Groups Section */}
                <Box className="groups-section">
                    <Typography variant="h5" component="h2" className="groups-title">
                        Your Groups
                    </Typography>

                    {groups.length === 0 ? (
                        <Paper className="empty-state-container">
                            <GroupIcon className="empty-state-icon" />
                            <Typography variant="h6" component="h3" className="empty-state-title">
                                No groups yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="empty-state-description">
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
                        <Box className="groups-grid">
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
