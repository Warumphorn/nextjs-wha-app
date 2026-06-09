"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = !mounted || resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background"
        aria-label="สลับธีม"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted hover:text-foreground"
      aria-label="สลับธีม"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
