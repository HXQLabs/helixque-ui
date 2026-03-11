"use client";

import type { KeyboardEvent } from "react";
import { IconFlag } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

type TimeoutAlertProps = {
  show: boolean;
  message: string;
  onRetry: () => void;
  onCancel: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
};

export default function TimeoutAlert({
  show,
  message,
  onRetry,
  onCancel,
  onKeyDown,
}: TimeoutAlertProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeout-title"
      onKeyDown={onKeyDown}
    >
      <div className="mx-4 max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/20">
            <IconFlag className="h-6 w-6 text-orange-400" />
          </div>

          <h3
            id="timeout-title"
            className="mb-2 text-lg font-semibold text-white"
          >
            No Match Found
          </h3>

          <p className="mb-6 text-sm text-neutral-400">
            {message ||
              "We couldn't find a match right now. Please try again later."}
          </p>

          <div className="flex gap-3">
            <Button
              onClick={onRetry}
              className="flex-1"
              variant="default"
              autoFocus
            >
              Try Again
            </Button>
            <Button onClick={onCancel} className="flex-1" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
