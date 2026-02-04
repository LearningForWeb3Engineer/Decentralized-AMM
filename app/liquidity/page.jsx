'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useLiquidity } from '../../hooks/useLiquidity';

export default function LiquidityPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('add'); // 'add' | 'remove'
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [lpAmount, setLpAmount] = useState('');
  const [txStatus, setTxStatus] = useState(''); // 'processing' | 'success' | ''
  const [error, setError] = useState('');

  const { lpBalance, balanceA, balanceB, addLiquidity, removeLiquidity } = useLiquidity();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleAdd = async () => {
    if (!amountA || !amountB) return;
    setError('');
    setTxStatus('processing');
    try {
      await addLiquidity(amountA, amountB);
      setTxStatus('success');
      setAmountA('');
      setAmountB('');
      setTimeout(() => setTxStatus(''), 3000);
    } catch (err) {
      setError(err.message);
      setTxStatus('');
    }
  };

  const handleRemove = async () => {
    if (!lpAmount) return;
    setError('');
    setTxStatus('processing');
    try {
      await removeLiquidity(lpAmount);
      setTxStatus('success');
      setLpAmount('');
      setTimeout(() => setTxStatus(''), 3000);
    } catch (err) {
      setError(err.message);
      setTxStatus('');
    }
  };

  const isProcessing = txStatus === 'processing';

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-24">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
          Liquidity
        </h1>
        <p className="text-[#6b7280] text-sm text-center mb-6">Manage your liquidity position</p>

        {/* LP Balance card */}
        <div className="bg-[#1c1c2e] rounded-2xl p-4 mb-4 flex justify-between items-center">
          <span className="text-[#6b7280] text-sm">Your LP Balance</span>
          <span className="text-white font-semibold">{parseFloat(lpBalance).toFixed(6)} LP</span>
        </div>

        {/* Add / Remove tabs */}
        <div className="flex bg-[#1c1c2e] rounded-xl p-1 mb-4">
          <button
            onClick={() => { setTab('add'); setError(''); setTxStatus(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === 'add' ? 'bg-[#2a2a3e] text-white' : 'text-[#6b7280] hover:text-white'}`}
          >
            Add
          </button>
          <button
            onClick={() => { setTab('remove'); setError(''); setTxStatus(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === 'remove' ? 'bg-[#2a2a3e] text-white' : 'text-[#6b7280] hover:text-white'}`}
          >
            Remove
          </button>
        </div>

        {/* Status banners */}
        {txStatus === 'success' && (
          <div className="mb-3 px-4 py-2.5 bg-[#0f2a1f] border border-[#10b981]/40 rounded-xl text-[#10b981] text-sm">
            {tab === 'add' ? 'Liquidity added!' : 'Liquidity removed!'}
          </div>
        )}
        {txStatus === 'processing' && (
          <div className="mb-3 px-4 py-2.5 bg-[#1c1c2e] border border-[#a855f7]/40 rounded-xl text-[#a855f7] text-sm">
            Processing… (approving if needed)
          </div>
        )}
        {error && (
          <div className="mb-3 px-4 py-2.5 bg-[#2a0f0f] border border-[#ef4444]/40 rounded-xl text-[#ef4444] text-sm">
            {error}
          </div>
        )}

        {tab === 'add' ? (
          <>
            <TokenInput label="TKA" balance={balanceA} value={amountA} onChange={setAmountA} disabled={isProcessing} />
            <div className="flex justify-center my-2">
              <span className="text-[#6b7280] text-xl">+</span>
            </div>
            <TokenInput label="TKB" balance={balanceB} value={amountB} onChange={setAmountB} disabled={isProcessing} />

            <button
              onClick={handleAdd}
              disabled={!isConnected || !amountA || !amountB || isProcessing}
              className="w-full mt-4 py-4 rounded-full font-semibold text-base transition-all duration-200 bg-[#6366f1] hover:bg-[#4f46e5] active:bg-[#4338ca] disabled:bg-[#2a2a3e] disabled:text-[#6b7280] disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing…' : !isConnected ? 'Connect Wallet' : 'Add Liquidity'}
            </button>
          </>
        ) : (
          <>
            {/* LP amount input */}
            <div className="bg-[#1c1c2e] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-[#6b7280]">LP Amount</span>
                <span className="text-xs text-[#6b7280]">
                  Max: <span
                    className="text-[#a8b2c1] font-semibold cursor-pointer hover:text-white transition"
                    onClick={() => setLpAmount(lpBalance)}
                  >
                    {parseFloat(lpBalance).toFixed(6)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={lpAmount}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '' || /^\d*\.?\d*$/.test(v)) setLpAmount(v);
                  }}
                  placeholder="0"
                  className="bg-transparent text-4xl font-light outline-none flex-1 w-0 placeholder-[#3d3d55]"
                  disabled={isProcessing}
                />
                <span className="text-sm font-semibold text-[#a8b2c1] shrink-0">LP</span>
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={!isConnected || !lpAmount || isProcessing}
              className="w-full mt-4 py-4 rounded-full font-semibold text-base transition-all duration-200 bg-[#ec4899] hover:bg-[#db2777] active:bg-[#be185d] disabled:bg-[#2a2a3e] disabled:text-[#6b7280] disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing…' : !isConnected ? 'Connect Wallet' : 'Remove Liquidity'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TokenInput({ label, balance, value, onChange, disabled }) {
  return (
    <div className="bg-[#1c1c2e] rounded-2xl p-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-[#6b7280]">{label}</span>
        <span className="text-xs text-[#6b7280]">
          Balance: <span className="text-[#a8b2c1] font-semibold">{parseFloat(balance).toFixed(2)}</span>
        </span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '' || /^\d*\.?\d*$/.test(v)) onChange(v);
        }}
        placeholder="0"
        className="bg-transparent text-4xl font-light outline-none w-full placeholder-[#3d3d55]"
        disabled={disabled}
      />
    </div>
  );
}
