import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import {
    ChevronRight as ChevronRightIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import type { Group } from '../../../../database';
import './GroupCard.css';
import { formatDate } from '../../../../utils';

interface GroupCardProps {
    group: Group;
    onClick: () => void;
    onDelete?: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, onDelete }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (onDelete) {
            onDelete(group.id);
        }
        setDeleteDialogOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    const Header = () => {
        return (
            <Box className="group-card-header">
                <Box className="group-card-info">
                    <Typography
                        variant="h6"
                        component="h3"
                        className={`group-title ${group.description ? 'has-description' : ''}`}
                    >
                        {group.name}
                    </Typography>
                    {group.description && (
                        <Typography
                            variant="body2"
                            className="group-description"
                        >
                            {group.description}
                        </Typography>
                    )}
                </Box>
                <Box className="group-delete-button">
                    <IconButton
                        size="small"
                        onClick={handleDeleteClick}
                        className="delete-button"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        );
    };

    const Footer = () => {
        return (
            <Box className="group-card-footer">
                <Typography variant="caption" className="group-created-date">
                    Created {formatDate(group.createdAt)}
                </Typography>
                <IconButton size="small" className="group-chevron-button">
                    <ChevronRightIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    };

    return (
        <>
            <Card onClick={onClick} className="group-card">
                <CardContent className="group-card-content">
                    <Header />
                    <Footer />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onClick={(e) => e.stopPropagation()}
            >
                <DialogTitle>Delete Group</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{group.name}"? This action cannot be undone and will remove all group data including members, payments, and balances.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GroupCard;
