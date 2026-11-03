import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import TaskForm from "./TaskForm";
import type { Task } from "../../types/task.types";
import type { CreateTaskFormValues } from "../../validations/task.validation";

interface TaskModalProps {
  isOpen: boolean;
  task: Task | null;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (data: CreateTaskFormValues) => Promise<void>;
}

const TaskModal = ({
  isOpen,
  task,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: TaskModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  const handleCancel = (
    event: React.SyntheticEvent<HTMLDialogElement>,
  ): void => {
    event.preventDefault();

    if (!isSubmitting) {
      onClose();
    }
  };

  const handleDialogClose = (): void => {
    if (isOpen && !isSubmitting) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClose={handleDialogClose}
      aria-labelledby="task-modal-title"
      aria-describedby="task-modal-description"
      className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50"
    >
      <div className="p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="task-modal-title"
              className="text-xl font-bold text-slate-900"
            >
              {task ? "Edit Task" : "Create Task"}
            </h2>

            <p
              id="task-modal-description"
              className="mt-1 text-sm text-slate-500"
            >
              {task
                ? "Update your task details."
                : "Add a new task to your workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close task form"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <TaskForm
          task={task}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </dialog>
  );
};

export default TaskModal;
