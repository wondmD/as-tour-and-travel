"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Optional summary, e.g. "Showing 1–10 of 128". */
  summary?: string;
  className?: string;
}

function pagesToShow(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  if (page <= 4) return [1, 2, 3, 4, 5, "…", pageCount];
  if (page >= pageCount - 3)
    return [1, "…", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "…", page - 1, page, page + 1, "…", pageCount];
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  summary,
  className,
}: PaginationProps) {
  if (pageCount <= 1 && !summary) return null;

  const navButton =
    "flex size-9 items-center justify-center rounded-xl border border-border/70 bg-white/60 text-text-secondary transition-colors hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className,
      )}
    >
      {summary && (
        <p className="text-xs text-text-secondary">{summary}</p>
      )}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={navButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>

        {pagesToShow(page, pageCount).map((item, index) =>
          item === "…" ? (
            <span
              key={`gap-${index}`}
              className="px-1 text-sm text-text-secondary/60"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
                item === page
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/25"
                  : "border border-border/70 bg-white/60 text-text-secondary hover:border-primary/30 hover:text-primary",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={navButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </button>
      </div>
    </nav>
  );
}
