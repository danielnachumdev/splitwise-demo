import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`add-data-tabpanel-${index}`}
            aria-labelledby={`add-data-tab-${index}`}
        >
            {value === index && <Box className="add-data-tabpanel-content">{children}</Box>}
        </div>
    );
};

export default TabPanel;
