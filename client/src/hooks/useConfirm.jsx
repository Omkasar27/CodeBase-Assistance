import { useState, useCallback, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert-dialog.jsx";

export function useConfirm() {
  const [state, setState] = useState(null);

  const confirm = useCallback((title, description) => {
    return new Promise((resolve) => {
      setState({
        title,
        description,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (state?.resolve) {
      state.resolve(true);
    }
    setState(null);
  }, [state]);

  const handleCancel = useCallback(() => {
    if (state?.resolve) {
      state.resolve(false);
    }
    setState(null);
  }, [state]);

  const ConfirmDialog = useMemo(
    () => (
      <AlertDialog
        open={!!state}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {state?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [state, handleConfirm, handleCancel]
  );

  return { confirm, ConfirmDialog };
}