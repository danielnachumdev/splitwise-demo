import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import './HomeHeader.css';

interface HomeHeaderProps {
    // currentUser parameter removed as it's not used
}

const HomeHeader: React.FC<HomeHeaderProps> = () => (
    <AppBar position="static" elevation={1} className="home-header-appbar">
        <Toolbar className="home-header-toolbar">
            <Box className="home-header-brand">
                <Typography variant="h4" component="h1" className="home-header-title">
                    Splitwise Demo
                </Typography>
                <Typography variant="body2" className="home-header-subtitle">
                    Manage your group expenses
                </Typography>
            </Box>
        </Toolbar>
    </AppBar>
);

export default HomeHeader;
