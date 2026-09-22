"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isNavItemActive } from "./navItems";

type NavLinkProps = {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

export function NavLink({ href, className = "", onClick, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`${className} ${active ? "text-primary" : "text-gray-300"}`}
    >
      {children}
    </Link>
  );
}
