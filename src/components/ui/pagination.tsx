import { Button } from "./button";
import { joinClasses } from "../classnames";

type PaginationProps = {
  className?: string;
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
};

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

function getVisiblePages(
  page: number,
  totalPages: number,
  maxVisiblePages: number,
): PaginationItem[] {
  if (totalPages <= maxVisiblePages + 2) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const sideWindow = Math.max(1, Math.floor(maxVisiblePages / 2));
  let start = Math.max(2, page - sideWindow);
  let end = Math.min(totalPages - 1, page + sideWindow);

  if (page <= sideWindow + 2) {
    start = 2;
    end = Math.min(totalPages - 1, maxVisiblePages);
  }

  if (page >= totalPages - sideWindow - 1) {
    start = Math.max(2, totalPages - maxVisiblePages + 1);
    end = totalPages - 1;
  }

  const pages: PaginationItem[] = [1];

  if (start > 2) {
    pages.push("ellipsis-start");
  }

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  className,
  maxVisiblePages = 5,
  onPageChange,
  page,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getVisiblePages(page, totalPages, maxVisiblePages);

  return (
    <nav
      aria-label="Pagination"
      className={joinClasses(
        "flex flex-wrap items-center justify-center gap-2",
        className,
      )}
    >
      <Button
        disabled={page <= 1}
        onClick={() => {
          onPageChange(page - 1);
        }}
        size="sm"
        variant="secondary"
      >
        Previous
      </Button>

      {items.map((item) =>
        typeof item === "number" ? (
          <Button
            aria-current={item === page ? "page" : undefined}
            className={item === page ? "pointer-events-none" : undefined}
            key={item}
            onClick={() => {
              onPageChange(item);
            }}
            size="sm"
            variant={item === page ? "primary" : "secondary"}
          >
            {item}
          </Button>
        ) : (
          <span
            aria-hidden="true"
            className="px-1 text-sm text-muted"
            key={item}
          >
            ...
          </span>
        ),
      )}

      <Button
        disabled={page >= totalPages}
        onClick={() => {
          onPageChange(page + 1);
        }}
        size="sm"
        variant="secondary"
      >
        Next
      </Button>
    </nav>
  );
}
