import type { ComponentPropsWithoutRef } from "react";
import { joinClasses } from "../classnames";
import { Input } from "./input";

type SearchInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  containerClassName?: string;
  label?: string;
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-muted"
      viewBox="0 0 20 20"
    >
      <circle
        cx="8.5"
        cy="8.5"
        fill="none"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m12.5 12.5 4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SearchInput({
  className,
  containerClassName,
  id = "search-input",
  label = "Search products",
  placeholder = "Search products...",
  ...props
}: SearchInputProps) {
  return (
    <div className={joinClasses("relative", containerClassName)}>
      <label className="sr-only" htmlFor={id}>{label}</label>

      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <SearchIcon />
      </div>

      <Input
        {...props}
        className={joinClasses("pl-10", className)}
        id={id}
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
}
