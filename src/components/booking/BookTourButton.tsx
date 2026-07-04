"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useBookTour } from "@/components/booking/BookTourProvider";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline";

interface BookTourButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onOpen?: () => void;
}

export function BookTourButton({
  children,
  variant = "accent",
  className = "",
  onOpen,
}: BookTourButtonProps) {
  const { open } = useBookTour();

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        onOpen?.();
        open();
      }}
    >
      {children}
    </Button>
  );
}
