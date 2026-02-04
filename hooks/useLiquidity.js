import { useReadContract, useWriteContract, useAccount, useConfig } from 'wagmi';
import { ADDRESSES, AMM_ABI, TOKEN_ABI } from '../contracts/config';
import { parseEther, formatEther } from 'ethers';
import { waitForTransactionReceipt } from '@wagmi/core';

export function useLiquidity() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  // LP token contract address from AMM
  const { data: lpTokenAddress } = useReadContract({
    address: ADDRESSES.amm,
    abi: AMM_ABI,
    functionName: 'lpToken',
  });

  // User LP token balance
  const { data: lpBalance, refetch: refetchLpBalance } = useReadContract({
    address: lpTokenAddress,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address && !!lpTokenAddress }
  });

  // TKA / TKB balances
  const { data: balanceA } = useReadContract({
    address: ADDRESSES.tokenA,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address }
  });

  const { data: balanceB } = useReadContract({
    address: ADDRESSES.tokenB,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address }
  });

  // Allowances for TKA & TKB
  const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
    address: ADDRESSES.tokenA,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: [address, ADDRESSES.amm],
    query: { enabled: !!address }
  });

  const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
    address: ADDRESSES.tokenB,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: [address, ADDRESSES.amm],
    query: { enabled: !!address }
  });

  // LP token allowance (needed before removeLiquidity)
  const { data: lpAllowance, refetch: refetchLpAllowance } = useReadContract({
    address: lpTokenAddress,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: [address, ADDRESSES.amm],
    query: { enabled: !!address && !!lpTokenAddress }
  });

  // Generic approve helper
  const approveToken = async (tokenAddress, amount) => {
    const hash = await writeContractAsync({
      address: tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [ADDRESSES.amm, amount],
    });
    await waitForTransactionReceipt(config, { hash });
  };

  // Add liquidity — auto-approves TKA & TKB if needed
  const addLiquidity = async (amountA, amountB) => {
    const weiA = parseEther(amountA);
    const weiB = parseEther(amountB);
    const deadline = Math.floor(Date.now() / 1000) + 1200;

    if (!allowanceA || allowanceA < weiA) {
      await approveToken(ADDRESSES.tokenA, weiA);
      refetchAllowanceA();
    }
    if (!allowanceB || allowanceB < weiB) {
      await approveToken(ADDRESSES.tokenB, weiB);
      refetchAllowanceB();
    }

    const hash = await writeContractAsync({
      address: ADDRESSES.amm,
      abi: AMM_ABI,
      functionName: 'addLiquidity',
      args: [weiA, weiB, deadline],
    });
    await waitForTransactionReceipt(config, { hash });
    refetchLpBalance();
    return { success: true, hash };
  };

  // Remove liquidity — auto-approves LP token if needed
  const removeLiquidity = async (lpAmount) => {
    const weiLP = parseEther(lpAmount);
    const deadline = Math.floor(Date.now() / 1000) + 1200;

    if (!lpAllowance || lpAllowance < weiLP) {
      await approveToken(lpTokenAddress, weiLP);
      refetchLpAllowance();
    }

    const hash = await writeContractAsync({
      address: ADDRESSES.amm,
      abi: AMM_ABI,
      functionName: 'removeLiquidity',
      args: [weiLP, deadline],
    });
    await waitForTransactionReceipt(config, { hash });
    refetchLpBalance();
    return { success: true, hash };
  };

  return {
    lpBalance: lpBalance ? formatEther(lpBalance) : '0',
    balanceA: balanceA ? formatEther(balanceA) : '0',
    balanceB: balanceB ? formatEther(balanceB) : '0',
    addLiquidity,
    removeLiquidity,
  };
}
