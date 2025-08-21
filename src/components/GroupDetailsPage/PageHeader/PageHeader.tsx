import React from 'react';
import {
    Paper,
    Container,
    Box,
    Typography,
    Button,
    Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import type { Group } from '../../../database';
import './PageHeader.css';

interface PageHeaderProps {
    group: Group;
    onBackClick: () => void;
    onAddDataClick: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ group, onBackClick, onAddDataClick }) => {
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

    return (
        <Paper elevation={1} className="page-header">
            <Container maxWidth="lg">
                <Box className="page-header-content">
                    <Box className="page-header-actions">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBackClick}
                        >
                            Back to Groups
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onAddDataClick}
                        >
                            Add Data
                        </Button>
                    </Box>

                    <Typography variant="h4" component="h1" className="page-header-title">
                        {group.name}
                    </Typography>

                    {group.description && (
                        <Typography variant="body1" className="page-header-description">
                            {group.description}
                        </Typography>
                    )}

                    <Chip
                        label={`${getCurrencySymbol(group.currency)} ${group.currency}`}
                        color="primary"
                        variant="outlined"
                        className="page-header-currency-chip"
                    />
                </Box>
            </Container>
        </Paper>
    );
};

export default PageHeader;
