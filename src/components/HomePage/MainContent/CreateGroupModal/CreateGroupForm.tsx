import React, { useState } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
    CircularProgress,
} from '@mui/material';

interface CreateGroupFormProps {
    onSubmit: (groupData: {
        name: string;
        description: string;
        currency: string;
    }) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        currency: 'USD',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

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

        try {
            await onSubmit({
                name: formData.name.trim(),
                description: formData.description.trim(),
                currency: formData.currency,
            });

            // Reset form
            setFormData({ name: '', description: '', currency: 'USD' });
            setErrors({});
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleCancel = () => {
        onCancel();
        // Reset form when canceling
        setFormData({ name: '', description: '', currency: 'USD' });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit}>
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

            {/* Form Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    onClick={handleCancel}
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
            </Box>
        </form>
    );
};

export default CreateGroupForm;
