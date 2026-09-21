import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "스토어", href: "/", active: true },
  { label: "AI OMR WORK", href: "#", active: false },
  { label: "챌린지", href: "#", active: false },
  { label: "히든카이스 소개", href: "#", active: false },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-2.5 drop-shadow-[0px_3px_2px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex h-20 w-full max-w-content items-center justify-between">
        <div className="flex items-center gap-[100px]">
          <Link href="/" aria-label="히든카이스 홈">
            <Image
              src="/icons/logo.svg"
              alt="HIDDEN KICE"
              width={142.851}
              height={17.472}
            />
          </Link>
          <nav aria-label="주 메뉴">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={`text-body-lg font-semibold whitespace-nowrap ${
                      item.active ? "text-primary" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </Link>
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
          />
          <IconButton icon="/icons/bell.svg" label="알림" badge={1} />
          <IconButton icon="/icons/user.svg" label="마이페이지" />
        </div>
      </div>
    </header>
  );
}

function IconButton({
  icon,
  label,
  badge,
}: {
  icon: string;
  label: string;
  badge?: number;
}) {
  return (
    <button type="button" aria-label={label} className="relative size-6">
      <Image src={icon} alt="" width={24} height={24} />
      {badge ? (
        <span className="absolute -top-1.5 left-3 flex size-[15px] items-center justify-center rounded-full bg-primary text-[10px] leading-[1.4] text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
