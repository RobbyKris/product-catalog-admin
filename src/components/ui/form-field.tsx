import type { ReactNode } from "react";
import { joinClasses } from "../classnames";

type FormFieldProps = {
  children: ReactNode;
  error?: string;
  helperText?: string;
  htmlFor?: string;
  label: string;
  required?: boolean;
};

export function FormField({
  children,
  error,
  helperText,
  htmlFor,
  label,
  required = false,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <label
        className="text-sm font-semibold text-text"
        htmlFor={htmlFor}
      >
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          className="text-xs font-medium text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p className={joinClasses("text-xs text-muted")}>{helperText}</p>
      ) : null}
    </div>
  );
}
