import React, { useState } from 'react';
import { Group as GroupIcon } from '@mui/icons-material';
import { Modal } from '../../../common/Modal';
import CreateGroupForm from './CreateGroupForm';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateGroup: (groupData: {
        name: string;
        description: string;
        currency: string;
    }) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    isOpen,
    onClose,
    onCreateGroup,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (groupData: {
        name: string;
        description: string;
        currency: string;
    }) => {
        setIsSubmitting(true);
        try {
            await onCreateGroup(groupData);
            onClose();
        } catch (error) {
            console.error('Error creating group:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Create New Group"
            subtitle="Create a new group to start managing shared expenses with friends, family, or roommates."
            icon={<GroupIcon />}
            disableBackdropClick={isSubmitting}
        >
            <CreateGroupForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
};

export default CreateGroupModal;
