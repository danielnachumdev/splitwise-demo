import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
} from '@mui/material';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    disableBackdropClick = false,
}) => {
    const handleClose = () => {
        if (!disableBackdropClick) {
            onClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {icon && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'primary.100',
                                color: 'primary.main',
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                    <Box>
                        <Typography variant="h6" component="h2">
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    {children}
                </Box>
            </DialogContent>

            {actions && (
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default Modal;
