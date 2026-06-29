import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-500/15 text-red-400">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-steel-400">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center text-[13px]">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 justify-center rounded-full bg-red-600 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-red-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
