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
    CircularProgress,
    Alert,
} from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateGroup: (groupData: {
        name: string;
        description: string;
        currency: string;
    }) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    isOpen,
    onClose,
    onCreateGroup,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        currency: 'USD',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    ];

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Group name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Group name must be at least 2 characters';
        }

        if (formData.description.trim().length > 200) {
            newErrors.description = 'Description must be less than 200 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onCreateGroup({
                name: formData.name.trim(),
                description: formData.description.trim(),
                currency: formData.currency,
            });

            // Reset form
            setFormData({ name: '', description: '', currency: 'USD' });
            setErrors({});
        } catch (error) {
            console.error('Error creating group:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            // Reset form when closing
            setFormData({ name: '', description: '', currency: 'USD' });
            setErrors({});
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'primary.100',
                                color: 'primary.main',
                            }}
                        >
                            <GroupIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" component="h2">
                                Create New Group
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create a new group to start managing shared expenses with friends, family, or roommates.
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        {/* Group Name */}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="groupName"
                            label="Group Name *"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="e.g., Roommates, Vacation Trip, Dinner Club"
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 3 }}
                        />

                        {/* Description */}
                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Optional description for your group"
                            error={!!errors.description}
                            helperText={
                                errors.description || `${formData.description.length}/200 characters`
                            }
                            sx={{ mb: 3 }}
                        />

                        {/* Currency */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="currency-label">Currency</InputLabel>
                            <Select
                                labelId="currency-label"
                                id="currency"
                                value={formData.currency}
                                label="Currency"
                                onChange={(e) => handleInputChange('currency', e.target.value)}
                            >
                                {currencies.map((currency) => (
                                    <MenuItem key={currency.code} value={currency.code}>
                                        {currency.symbol} {currency.code} - {currency.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        sx={{ minWidth: 100 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ minWidth: 100 }}
                    >
                        {isSubmitting ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} />
                                Creating...
                            </Box>
                        ) : (
                            'Create Group'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateGroupModal;
