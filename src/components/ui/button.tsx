import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { joinClasses } from "../classnames";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-white hover:border-primary-strong hover:bg-primary-strong",
  secondary:
    "border-border bg-surface text-text hover:bg-surface-2 hover:border-[#ccb7a8]",
  ghost:
    "border-transparent bg-transparent text-text hover:bg-surface-2 hover:border-surface-2",
  danger:
    "border-danger bg-danger text-white hover:border-[#8f382f] hover:bg-[#8f382f]",
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-11 px-5 text-base",
};

function ButtonSpinner() {
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

export function Button({
  className,
  children,
  disabled,
  fullWidth = false,
  isLoading = false,
  leadingIcon,
  loadingLabel = "Loading...",
  size = "md",
  trailingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      className={joinClasses(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-field border font-semibold transition hover:-translate-y-px disabled:translate-y-0 disabled:opacity-60",
        variantClassNames[variant],
        sizeClassNames[size],
        fullWidth ? "w-full" : undefined,
        className,
      )}
      disabled={isDisabled}
      type={type}
    >
      {isLoading ? <ButtonSpinner /> : leadingIcon}
      <span className="whitespace-nowrap">
        {isLoading ? loadingLabel : children}
      </span>
      {!isLoading ? trailingIcon : null}
    </button>
  );
}
