import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmActionProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmActionProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
    title,
    message,
    onConfirm,
    onCancel,
    isOpen,
    setIsOpen,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onCancel()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm()}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmAction;
