'use client';

import { useState, useEffect } from 'react';
import { usePool } from '../../hooks/usePool';

export default function PoolPage() {
  const [mounted, setMounted] = useState(false);
  const { reserveA, reserveB, price, paused, isLoading } = usePool();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const tvl = (parseFloat(reserveA) + parseFloat(reserveB)).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24">
      <div className="w-full max-w-lg">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
          Pool Overview
        </h1>
        <p className="text-[#6b7280] text-sm text-center mb-6">TKA / TKB Liquidity Pool</p>

        {/* Active / Paused badge */}
        <div className="flex justify-center mb-6">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${paused ? 'bg-[#2a1a0f] text-[#f59e0b]' : 'bg-[#0f2a1f] text-[#10b981]'}`}>
            <span className={`w-2 h-2 rounded-full ${paused ? 'bg-[#f59e0b]' : 'bg-[#10b981]'}`} />
            {paused ? 'Pool Paused' : 'Pool Active'}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard label="TVL" value={isLoading ? '—' : `${tvl} tokens`} />
          <StatCard label="Fee Rate" value="0.3%" />
        </div>

        {/* Reserves */}
        <div className="bg-[#1c1c2e] rounded-2xl p-5 mb-4">
          <h2 className="text-xs text-[#6b7280] uppercase tracking-wider mb-4 font-medium">Reserves</h2>
          <ReserveRow token="TKA" value={isLoading ? '—' : parseFloat(reserveA).toFixed(4)} />
          <div className="h-px bg-[#2a2a3e] my-3" />
          <ReserveRow token="TKB" value={isLoading ? '—' : parseFloat(reserveB).toFixed(4)} />
        </div>

        {/* Price */}
        <div className="bg-[#1c1c2e] rounded-2xl p-5">
          <h2 className="text-xs text-[#6b7280] uppercase tracking-wider mb-4 font-medium">Price</h2>
          <div className="flex justify-between mb-2">
            <span className="text-[#6b7280] text-sm">1 TKA =</span>
            <span className="text-white font-semibold">{isLoading ? '—' : parseFloat(price).toFixed(6)} TKB</span>
          </div>
          {parseFloat(price) > 0 && (
            <div className="flex justify-between">
              <span className="text-[#6b7280] text-sm">1 TKB =</span>
              <span className="text-white font-semibold">{(1 / parseFloat(price)).toFixed(6)} TKA</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#1c1c2e] rounded-2xl p-4">
      <p className="text-[#6b7280] text-xs mb-1">{label}</p>
      <p className="text-white font-semibold text-lg">{value}</p>
    </div>
  );
}

function ReserveRow({ token, value }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#2a2a3e] flex items-center justify-center text-xs font-bold text-[#a8b2c1]">
          {token[0]}
        </div>
        <span className="text-[#a8b2c1] text-sm">{token}</span>
      </div>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
