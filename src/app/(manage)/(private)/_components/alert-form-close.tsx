import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../../components/ui/alert-dialog";

function AlertFormClose({
  open,
  onOpenChange,
  setFormOpen,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setFormOpen: (open: boolean) => void;
}) {
  const handleClose = () => {
    onOpenChange(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to close the form?
          </AlertDialogTitle>
          <AlertDialogDescription>
            All unsaved changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setFormOpen(false)}>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertFormClose;
