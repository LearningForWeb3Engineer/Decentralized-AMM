'use client';

import { useState, useEffect } from 'react';
import { useHistory } from '../../hooks/useHistory';
import { formatEther } from 'ethers';

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);
  const { events, isLoading } = useHistory();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
          History
        </h1>
        <p className="text-[#6b7280] text-sm text-center mb-6">Recent pool transactions</p>

        {/* Table */}
        <div className="bg-[#1c1c2e] rounded-2xl overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[110px_1fr_140px_100px] gap-3 px-5 py-3 border-b border-[#2a2a3e]">
            <span className="text-xs text-[#6b7280] font-medium">Type</span>
            <span className="text-xs text-[#6b7280] font-medium">Details</span>
            <span className="text-xs text-[#6b7280] font-medium">User</span>
            <span className="text-xs text-[#6b7280] font-medium text-right">Block</span>
          </div>

          {isLoading ? (
            <div className="px-5 py-10 text-center text-[#6b7280] text-sm">Loading…</div>
          ) : events.length === 0 ? (
            <div className="px-5 py-10 text-center text-[#6b7280] text-sm">No transactions found</div>
          ) : (
            events.map((event, idx) => <EventRow key={idx} event={event} />)
          )}
        </div>
      </div>
    </div>
  );
}

// Colour + content per event type
const TYPE_STYLE = {
  'Swap':             { color: '#ec4899' },
  'Add Liquidity':    { color: '#10b981' },
  'Remove Liquidity': { color: '#f59e0b' },
};

function EventRow({ event }) {
  const { eventType, args, blockNumber, transactionHash } = event;
  const { color } = TYPE_STYLE[eventType] || { color: '#a8b2c1' };

  let details = '—';
  let user = '—';

  if (eventType === 'Swap') {
    details = `${fmtNum(formatEther(args.amountIn))} → ${fmtNum(formatEther(args.amountOut))}`;
    user = shortenAddr(args.user);
  } else if (eventType === 'Add Liquidity') {
    details = `${fmtNum(formatEther(args.amountA))} TKA + ${fmtNum(formatEther(args.amountB))} TKB`;
    user = shortenAddr(args.provider);
  } else if (eventType === 'Remove Liquidity') {
    details = `${fmtNum(formatEther(args.amountA))} TKA + ${fmtNum(formatEther(args.amountB))} TKB`;
    user = shortenAddr(args.provider);
  }

  return (
    <div className="grid grid-cols-[110px_1fr_140px_100px] gap-3 px-5 py-3 border-b border-[#2a2a3e]/50 hover:bg-[#2a2a3e]/30 transition items-center">
      <span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ color, backgroundColor: `${color}18` }}>
          {eventType}
        </span>
      </span>
      <span className="text-[#a8b2c1] text-sm truncate">{details}</span>
      <span className="text-[#6b7280] text-sm font-mono">{user}</span>
      <span className="text-right">
        <a
          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6b7280] text-sm hover:text-[#ec4899] transition"
        >
          #{Number(blockNumber)}
        </a>
      </span>
    </div>
  );
}

function shortenAddr(addr) {
  if (!addr) return '—';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function fmtNum(numStr) {
  const n = parseFloat(numStr);
  if (n === 0) return '0';
  if (n < 0.001) return '<0.001';
  if (n < 1) return n.toFixed(4);
  if (n < 1000) return n.toFixed(2);
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
