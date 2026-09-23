import Image from "next/image";
import Link from "next/link";
import { MobileNavMenu } from "./MobileNavMenu";
import { NavLink } from "./NavLink";
import { NAV_ITEMS } from "./navItems";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-2.5 drop-shadow-[0px_3px_2px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex h-14 w-full max-w-content items-center justify-between lg:h-20">
        <div className="flex items-center gap-6 lg:gap-[100px]">
          <Link href="/" aria-label="히든카이스 홈">
            <Image
              src="/icons/logo.svg"
              alt="HIDDEN KICE"
              width={142.851}
              height={17.472}
            />
          </Link>
          <nav aria-label="주 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <NavLink
                    href={item.href}
                    className="text-body-lg whitespace-nowrap"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <IconButton
            icon="/icons/shopping-cart.svg"
            label="장바구니"
            badge={1}
            badgeLeft={14}
          />
          <IconButton
            icon="/icons/bell.svg"
            label="알림"
            badge={1}
            badgeLeft={11}
          />
          <IconButton icon="/icons/user.svg" label="마이페이지" />
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}

function IconButton({
  icon,
  label,
  badge,
  badgeLeft = 12,
}: {
  icon: string;
  label: string;
  badge?: number;
  badgeLeft?: number;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`relative h-6 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${badge ? "w-[27px]" : "w-6"}`}
    >
      <Image src={icon} alt="" width={24} height={24} />
      {badge ? (
        <span
          aria-hidden
          className="absolute -top-1.5 flex size-[15px] items-center justify-center rounded-full bg-primary text-[10px] leading-[1.4] text-white"
          style={{ left: badgeLeft }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
