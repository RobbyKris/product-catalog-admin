import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { joinClasses } from "../classnames";
import { IconButton } from "./icon-button";
import { FiX } from "react-icons/fi";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalProps = {
  children: React.ReactNode;
  className?: string;
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  description?: string;
  footer?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  panelClassName?: string;
  size?: ModalSize;
  title: string;
};

const sizeClassNames: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
};

export function Modal({
  children,
  className,
  closeLabel = "Close",
  closeOnOverlayClick = true,
  description,
  footer,
  isOpen,
  onOpenChange,
  panelClassName,
  size = "md",
  title,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onOpenChange]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c1f18]/45 px-4 py-6 backdrop-blur-[2px]"
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
      role="presentation"
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={joinClasses(
          "flex max-h-[calc(100vh-3rem)] w-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-floating",
          sizeClassNames[size],
          panelClassName,
          className,
        )}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-text" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="text-sm text-muted" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>

          <IconButton
            aria-label={closeLabel}
            className="group -mr-1 shrink-0 rounded-full shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0"
            onClick={() => {
              onOpenChange(false);
            }}
            size="sm"
            title={closeLabel}
            variant="primary"
          >
            <FiX
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
            />
          </IconButton>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-border px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
