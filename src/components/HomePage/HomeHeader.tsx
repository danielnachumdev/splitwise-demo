import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import type { User } from '../../database';

interface HomeHeaderProps {
    currentUser: User | null;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ currentUser }) => (
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
);

export default HomeHeader;
