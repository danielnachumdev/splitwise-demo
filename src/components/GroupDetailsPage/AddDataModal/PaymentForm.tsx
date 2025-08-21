import React from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import type { PaymentCategory, User } from '../../../database';
import './AddDataModal.css';

interface PaymentFormProps {
    paymentForm: {
        description: string;
        amount: string;
        category: PaymentCategory;
        paidBy: string;
        participants: string[];
        participantShares: Record<string, string>;
    };
    existingUsers: User[];
    paymentCategories: PaymentCategory[];
    onFormChange: (field: string, value: any) => void;
    onParticipantToggle: (userId: string) => void;
    onShareChange: (userId: string, share: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    paymentForm,
    existingUsers,
    paymentCategories,
    onFormChange,
    onParticipantToggle,
    onShareChange,
}) => {
    return (
        <>
            <Typography variant="subtitle1" className="add-data-subtitle">
                Create a new payment statement
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={paymentForm.description}
                        onChange={(e) => onFormChange('description', e.target.value)}
                        className="add-data-form-field"
                        placeholder="e.g., Grocery shopping, Dinner, etc."
                    />

                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={paymentForm.amount}
                        onChange={(e) => onFormChange('amount', e.target.value)}
                        className="add-data-form-field"
                        placeholder="0.00"
                        inputProps={{ step: "0.01", min: "0" }}
                    />

                    <FormControl fullWidth className="add-data-form-field">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={paymentForm.category}
                            label="Category"
                            onChange={(e) => onFormChange('category', e.target.value)}
                        >
                            {paymentCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth className="add-data-form-field">
                        <InputLabel>Paid By</InputLabel>
                        <Select
                            value={paymentForm.paidBy}
                            label="Paid By"
                            onChange={(e) => onFormChange('paidBy', e.target.value)}
                        >
                            {existingUsers.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" className="add-data-participants-title">
                        Select Participants & Set Shares
                    </Typography>

                    <Box className="add-data-participants-list">
                        {existingUsers.map((user) => (
                            <Box key={user.id} className="add-data-participant-item">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentForm.participants.includes(user.id)}
                                            onChange={() => onParticipantToggle(user.id)}
                                        />
                                    }
                                    label={user.name}
                                />

                                {paymentForm.participants.includes(user.id) && (
                                    <TextField
                                        size="small"
                                        label="Share Amount"
                                        type="number"
                                        value={paymentForm.participantShares[user.id] || ''}
                                        onChange={(e) => onShareChange(user.id, e.target.value)}
                                        className="add-data-participant-share"
                                        placeholder="0.00"
                                        inputProps={{ step: "0.01", min: "0" }}
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>

                    {paymentForm.participants.length > 0 && (
                        <Box className="add-data-total-shares">
                            <Typography variant="caption" color="text.secondary">
                                Total shares: {paymentForm.participants.reduce((sum, userId) =>
                                    sum + parseFloat(paymentForm.participantShares[userId] || '0'), 0
                                ).toFixed(2)}
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default PaymentForm;
