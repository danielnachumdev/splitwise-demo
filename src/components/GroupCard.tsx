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
import type { Group } from '../types';

interface GroupCardProps {
    group: Group;
    onClick: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
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

    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                    '& .group-title': {
                        color: 'primary.main',
                    },
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h6"
                            component="h3"
                            className="group-title"
                            sx={{
                                fontWeight: 600,
                                mb: group.description ? 1 : 0,
                                transition: 'color 0.2s ease-in-out',
                            }}
                        >
                            {group.name}
                        </Typography>
                        {group.description && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.4,
                                }}
                            >
                                {group.description}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ ml: 2, flexShrink: 0 }}>
                        <Chip
                            label={`${getCurrencySymbol(group.currency)} ${group.currency}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                            }}
                        />
                    </Box>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 1,
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Created {formatDate(group.createdAt)}
                    </Typography>
                    <IconButton
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GroupCard;
