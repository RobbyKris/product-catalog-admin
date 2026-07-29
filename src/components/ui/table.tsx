import type { ComponentPropsWithoutRef } from "react";
import { joinClasses } from "../classnames";

export function Table({
  className,
  ...props
}: ComponentPropsWithoutRef<"table">) {
  return (
    <table
      {...props}
      className={joinClasses("w-full border-collapse text-sm", className)}
    />
  );
}

export function TableHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<"thead">) {
  return (
    <thead
      {...props}
      className={joinClasses("bg-surface-2/70", className)}
    />
  );
}

export function TableBody({
  className,
  ...props
}: ComponentPropsWithoutRef<"tbody">) {
  return <tbody {...props} className={joinClasses(className)} />;
}

export function TableRow({
  className,
  ...props
}: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr
      {...props}
      className={joinClasses(
        "border-b border-border last:border-b-0 hover:bg-surface-2/60",
        className,
      )}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      {...props}
      className={joinClasses(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted",
        className,
      )}
    />
  );
}

export function TableCell({
  className,
  ...props
}: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      {...props}
      className={joinClasses("px-4 py-4 align-middle text-text", className)}
    />
  );
}
