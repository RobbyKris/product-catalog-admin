import { Button } from "./button";
import { Modal } from "./modal";

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  isLoading?: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

export function ConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
  description,
  isLoading = false,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Modal
      closeOnOverlayClick={!isLoading}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            disabled={isLoading}
            onClick={onCancel}
            variant="secondary"
          >
            {cancelLabel}
          </Button>

          <Button
            isLoading={isLoading}
            loadingLabel="Deleting..."
            onClick={onConfirm}
            variant="danger"
          >
            {confirmLabel}
          </Button>
        </div>
      }
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          onCancel();
        }
      }}
      size="sm"
      title={title}
    >
      <p className="text-sm leading-6 text-muted">{description}</p>
    </Modal>
  );
}
