export const NAV_ITEMS = [
  { label: "스토어", href: "/" },
  { label: "AI OMR WORK", href: "#" },
  { label: "챌린지", href: "#" },
  { label: "히든카이스 소개", href: "#" },
];

// "/"는 정확히 일치할 때만, 그 외 메뉴는 하위 경로(/challenge/1 등)까지 활성으로 본다.
export function isNavItemActive(pathname: string, href: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
