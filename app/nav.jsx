'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Swap', href: '/' },
  { label: 'Pool', href: '/pool' },
  { label: 'Liquidity', href: '/liquidity' },
  { label: 'History', href: '/history' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1c1c2e] px-6 py-3 flex items-center justify-between">
      <div className="flex gap-1">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-[#ec4899] text-white'
                : 'text-[#6b7280] hover:text-white hover:bg-[#1c1c2e]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <ConnectButton size="small" />
    </nav>
  );
}
