import React from 'react';
import { TextField, Typography } from '@mui/material';
import './AddDataModal.css';

interface UserFormProps {
    userForm: {
        name: string;
        email: string;
    };
    onFormChange: (field: string, value: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userForm, onFormChange }) => {
    return (
        <>
            <Typography variant="subtitle1" className="add-data-subtitle">
                Add a new user to this group
            </Typography>

            <TextField
                fullWidth
                label="Name"
                value={userForm.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                className="add-data-form-field"
                placeholder="Enter user's full name"
            />

            <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                placeholder="Enter user's email address"
            />
        </>
    );
};

export default UserForm;
