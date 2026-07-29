import type { ComponentPropsWithoutRef } from "react";
import { joinClasses } from "../classnames";

export function CardList({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={joinClasses("grid gap-3", className)} />;
}
