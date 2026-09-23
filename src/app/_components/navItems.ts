export const NAV_ITEMS = [
  { label: "스토어", href: "/" },
  { label: "AI OMR WORK", href: "#" },
  { label: "챌린지", href: "#" },
  { label: "히든카이스 소개", href: "#" },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
