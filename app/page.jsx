'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAMM } from '../hooks/useAMM';
import { ADDRESSES } from '../contracts/config';
import { parseEther, formatEther } from 'ethers';

export default function Home() {
  const { isConnected } = useAccount();
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [isTokenAtoB, setIsTokenAtoB] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [txStatus, setTxStatus] = useState(''); // 'approving' | 'swapping' | 'success' | ''
  const [error, setError] = useState('');

  const tokenInAddress = isTokenAtoB ? ADDRESSES.tokenA : ADDRESSES.tokenB;
  const amountInWei = amountIn ? parseEther(amountIn) : 0n;

  const { balanceA, balanceB, amountOutData, allowance, swap, approve } = useAMM({
    tokenIn: tokenInAddress,
    amountIn: amountInWei,
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (amountOutData && amountIn) {
      setAmountOut(formatEther(amountOutData));
    } else {
      setAmountOut('');
    }
  }, [amountOutData, amountIn]);

  const handleSwapDirection = () => {
    setIsTokenAtoB(!isTokenAtoB);
    setAmountIn('');
    setAmountOut('');
  };

  const handleSwap = async () => {
    if (!amountIn || !amountOut) return;
    setError('');
    setTxStatus('');

    try {
      // Auto-approve if allowance is insufficient
      if (allowance < amountInWei) {
        setTxStatus('approving');
        await approve(tokenInAddress, amountInWei);
      }

      setTxStatus('swapping');
      const minAmountOut = (parseFloat(amountOut) * 0.99).toString();
      const result = await swap(tokenInAddress, amountIn, minAmountOut);

      if (result.success) {
        setTxStatus('success');
        setAmountIn('');
        setAmountOut('');
        setTimeout(() => setTxStatus(''), 3000);
      } else {
        setError(result.error);
        setTxStatus('');
      }
    } catch (err) {
      setError(err.message);
      setTxStatus('');
    }
  };

  const isProcessing = txStatus === 'approving' || txStatus === 'swapping';

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
          AMM
        </h1>
        <p className="text-[#6b7280] text-sm mt-1 tracking-wide">Decentralized Token Swap</p>
      </div>

      {/* Swap Card */}
      <div className="w-full max-w-md">
        {/* Status / Error banners */}
        {txStatus === 'success' && (
          <div className="mb-3 px-4 py-2.5 bg-[#0f2a1f] border border-[#10b981]/40 rounded-xl text-[#10b981] text-sm">
            Swap successful!
          </div>
        )}
        {txStatus === 'approving' && (
          <div className="mb-3 px-4 py-2.5 bg-[#1c1c2e] border border-[#a855f7]/40 rounded-xl text-[#a855f7] text-sm">
            Approving token…
          </div>
        )}
        {error && (
          <div className="mb-3 px-4 py-2.5 bg-[#2a0f0f] border border-[#ef4444]/40 rounded-xl text-[#ef4444] text-sm">
            {error}
          </div>
        )}

        {/* Input Token */}
        <div className="bg-[#1c1c2e] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[#6b7280]">You pay</span>
            <span className="text-xs text-[#6b7280]">
              Balance: <span className="text-[#a8b2c1] font-semibold">{parseFloat(isTokenAtoB ? balanceA : balanceB).toFixed(2)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={amountIn}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setAmountIn(value);
                  setError('');
                }
              }}
              placeholder="0"
              className="bg-transparent text-4xl font-light outline-none flex-1 w-0 placeholder-[#3d3d55]"
              disabled={isProcessing}
            />
            <button className="flex items-center gap-1.5 bg-[#2a2a3e] hover:bg-[#353550] px-4 py-2 rounded-full text-sm font-semibold transition shrink-0">
              {isTokenAtoB ? 'TKA' : 'TKB'}
              <span className="text-[#6b7280] text-xs">▼</span>
            </button>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center -my-3.5 relative z-10">
          <button
            onClick={handleSwapDirection}
            disabled={isProcessing}
            className="bg-[#1c1c2e] border-[3px] border-[#0a0a0f] w-11 h-11 rounded-full flex items-center justify-center text-[#a8b2c1] hover:text-white hover:bg-[#2a2a3e] transition disabled:opacity-50"
          >
            ↓
          </button>
        </div>

        {/* Output Token */}
        <div className="bg-[#1c1c2e] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[#6b7280]">You receive</span>
            <span className="text-xs text-[#6b7280]">
              Balance: <span className="text-[#a8b2c1] font-semibold">{parseFloat(isTokenAtoB ? balanceB : balanceA).toFixed(2)}</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={amountOut ? parseFloat(amountOut).toFixed(6) : ''}
              readOnly
              placeholder="0"
              className="bg-transparent text-4xl font-light outline-none flex-1 w-0 placeholder-[#3d3d55] text-[#a8b2c1]"
            />
            <button className="flex items-center gap-1.5 bg-[#2a2a3e] hover:bg-[#353550] px-4 py-2 rounded-full text-sm font-semibold transition shrink-0">
              {isTokenAtoB ? 'TKB' : 'TKA'}
              <span className="text-[#6b7280] text-xs">▼</span>
            </button>
          </div>
        </div>

        {/* Exchange Rate */}
        {amountIn && amountOut && (
          <div className="px-1 py-2">
            <span className="text-xs text-[#6b7280]">
              1 {isTokenAtoB ? 'TKA' : 'TKB'} ≈ {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)} {isTokenAtoB ? 'TKB' : 'TKA'}
              <span className="ml-2 text-[#4a4a5a]">· Slippage 1%</span>
            </span>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!isConnected || !amountIn || isProcessing}
          className="w-full mt-2 py-4 rounded-full font-semibold text-base transition-all duration-200 bg-[#ec4899] hover:bg-[#db2777] active:bg-[#be185d] disabled:bg-[#2a2a3e] disabled:text-[#6b7280] disabled:cursor-not-allowed"
        >
          {txStatus === 'approving' ? 'Approving…' : txStatus === 'swapping' ? 'Swapping…' : !isConnected ? 'Connect Wallet' : 'Swap'}
        </button>
      </div>
    </div>
  );
}
