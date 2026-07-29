import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { joinClasses } from "../classnames";

type IconButtonVariant = "ghost" | "secondary" | "primary" | "danger";
type IconButtonSize = "sm" | "md";

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  "aria-label": string;
  children: ReactNode;
  isLoading?: boolean;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

const variantClassNames: Record<IconButtonVariant, string> = {
  ghost:
    "border-transparent bg-transparent text-text hover:border-surface-2 hover:bg-surface-2",
  secondary:
    "border-border bg-surface text-text hover:border-[#ccb7a8] hover:bg-surface-2",
  primary:
    "border-primary bg-primary text-white hover:border-primary-strong hover:bg-primary-strong",
  danger:
    "border-danger/15 bg-danger-soft text-danger hover:border-danger/30 hover:bg-[#f3d7d4]",
};

const sizeClassNames: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
};

function IconButtonSpinner() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        fill="none"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        d="M22 12a10 10 0 0 0-10-10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export function IconButton({
  "aria-label": ariaLabel,
  className,
  children,
  disabled,
  isLoading = false,
  size = "md",
  type = "button",
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      className={joinClasses(
        "inline-flex items-center justify-center rounded-field border transition hover:-translate-y-px disabled:translate-y-0 disabled:opacity-60",
        variantClassNames[variant],
        sizeClassNames[size],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
    >
      {isLoading ? <IconButtonSpinner /> : children}
    </button>
  );
}
