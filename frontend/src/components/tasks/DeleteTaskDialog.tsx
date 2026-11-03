import { useEffect, useRef } from "react";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";

import type { Task } from "../../types/task.types";

interface DeleteTaskDialogProps {
  task: Task | null;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteTaskDialog = ({
  task,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteTaskDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (task && !dialog.open) {
      dialog.showModal();
    } else if (!task && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [task]);

  const handleCancel = (
    event: React.SyntheticEvent<HTMLDialogElement>,
  ): void => {
    event.preventDefault();

    if (!isDeleting) {
      onClose();
    }
  };

  const handleClose = (): void => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClose={handleClose}
      aria-labelledby="delete-task-title"
      aria-describedby="delete-task-description"
      className="m-auto w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50"
    >
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={24} aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            aria-label="Close delete confirmation"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <h2 id="delete-task-title" className="text-xl font-bold text-slate-900">
          {error ? "Unable to Delete Task" : "Delete Task?"}
        </h2>

        {error ? (
          <p
            id="delete-task-description"
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : (
          <p
            id="delete-task-description"
            className="mt-2 text-sm leading-6 text-slate-600"
          >
            Are you sure you want to delete{" "}
            <span className="font-semibold wrap-break-word text-slate-900">
              {task?.title}
            </span>
            ? This action cannot be undone.
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {error ? "Close" : "Cancel"}
          </button>

          {!error && (
            <button
              type="button"
              onClick={() => void onConfirm()}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle size={17} aria-hidden="true" />
              )}

              {isDeleting ? "Deleting..." : "Delete Task"}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default DeleteTaskDialog;
