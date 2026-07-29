import { createElement } from "react";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { joinClasses } from "../classnames";

type CardTag = "article" | "div" | "section";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: CardTag;
};

export function Card({
  as = "div",
  className,
  ...props
}: CardProps) {
  return createElement(as, {
    ...props,
    className: joinClasses(
      "overflow-hidden rounded-card border border-border bg-surface shadow-soft",
      className,
    ),
  });
}

export function CardBody({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={joinClasses("p-4", className)} />;
}

export function CardFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={joinClasses("border-t border-border px-4 py-4", className)}
    />
  );
}

export function CardMedia({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={joinClasses(
        "overflow-hidden rounded-field border border-border bg-surface-2",
        className,
      )}
    />
  );
}
