import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 bg-card border border-border rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                    >
                        {isLoading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;