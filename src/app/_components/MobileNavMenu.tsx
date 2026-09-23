"use client";

import { useEffect, useId, useRef, useState } from "react";
import { NavLink } from "./NavLink";
import { NAV_ITEMS } from "./navItems";

const DESKTOP_QUERY = "(min-width: 64rem)";

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && containerRef.current?.contains(e.target)) {
        return;
      }
      setOpen(false);
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    desktop.addEventListener("change", handleDesktop);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      desktop.removeEventListener("change", handleDesktop);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex size-6 items-center justify-center rounded-sm text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d={open ? "M18 6L6 18M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <nav
          id={menuId}
          aria-label="주 메뉴"
          className="absolute inset-x-0 top-full border-t border-gray-50 bg-white shadow-md"
        >
          <ul className="mx-auto flex max-w-content flex-col px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-body-lg"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
