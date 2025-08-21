import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
} from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import type { Group } from '../../../../database';
import './GroupCard.css';

interface GroupCardProps {
    group: Group;
    onClick: () => void;
}

// Utility functions extracted for better readability and testability
const getCurrencySymbol = (currencyCode: string): string => {
    const symbols: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'CAD': 'C$',
        'AUD': 'A$',
        'JPY': '¥',
    };
    return symbols[currencyCode] || currencyCode;
};

const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {

    const Header = () => {
        return <Box className="group-card-header">
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
            <Box className="group-currency-chip">
                <Chip
                    label={`${getCurrencySymbol(group.currency)} ${group.currency}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    className="currency-chip"
                />
            </Box>
        </Box>
    }

    const Footer = () => {
        return <Box className="group-card-footer">
            <Typography variant="caption" className="group-created-date">
                Created {formatDate(group.createdAt)}
            </Typography>
            <IconButton size="small" className="group-chevron-button">
                <ChevronRightIcon fontSize="small" />
            </IconButton>
        </Box>
    }

    // Render logic
    return (
        <Card onClick={onClick} className="group-card">
            <CardContent className="group-card-content">
                <Header />
                <Footer />
            </CardContent>
        </Card>
    );
};

export default GroupCard;
