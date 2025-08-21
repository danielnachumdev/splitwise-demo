import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import type { User, UserBalance } from '../../../database';
import MemberPreview from './MemberPreview';
import './MembersPanel.css';

interface MembersPanelProps {
    users: User[];
    userBalances: UserBalance[];
    currency: string;
    onUserClick: (user: User) => void;
}

const MembersPanel: React.FC<MembersPanelProps> = ({
    users,
    userBalances,
    currency,
    onUserClick
}) => {
    const getUserBalance = (userId: string): UserBalance | null => {
        return userBalances.find(balance => balance.userId === userId) || null;
    };

    return (
        <Paper className="members-panel">
            <Typography variant="h6" component="h2" className="members-panel-title">
                Group Members ({users.length})
            </Typography>

            <Box className="members-panel-content">
                <Box className="members-panel-list">
                    {users.map((user) => {
                        const balance = getUserBalance(user.id);
                        return (
                            <Box key={user.id} className="members-panel-item">
                                <MemberPreview
                                    user={user}
                                    balance={balance}
                                    currency={currency}
                                    onClick={onUserClick}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Paper>
    );
};

export default MembersPanel;
