import { useReadContract, useWriteContract, useAccount, useConfig } from 'wagmi';
import { ADDRESSES, AMM_ABI, TOKEN_ABI } from '../contracts/config';
import { parseEther, formatEther } from 'ethers';
import { waitForTransactionReceipt } from '@wagmi/core';

export function useAMM({ tokenIn, amountIn }) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();

  const { data: balanceA, refetch: refetchBalanceA } = useReadContract({
    address: ADDRESSES.tokenA,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address }
  });

  const { data: balanceB, refetch: refetchBalanceB } = useReadContract({
    address: ADDRESSES.tokenB,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address }
  });

  // Allowance: how much the AMM is allowed to spend of tokenIn
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: tokenIn,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: [address, ADDRESSES.amm],
    query: { enabled: !!address && !!tokenIn }
  });

  const { data: amountOutData } = useReadContract({
    address: ADDRESSES.amm,
    abi: AMM_ABI,
    functionName: 'getAmountOut',
    args: [tokenIn, amountIn],
    query: { enabled: amountIn > 0n }
  });

  // Approve tokenAddress for the AMM to spend `amount`
  const approve = async (tokenAddress, amount) => {
    const hash = await writeContractAsync({
      address: tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [ADDRESSES.amm, amount],
    });
    await waitForTransactionReceipt(config, { hash });
    refetchAllowance();
  };

  const swap = async (tokenInAddr, amountInStr, minAmountOutStr) => {
    try {
      const deadline = Math.floor(Date.now() / 1000) + 1200;
      const hash = await writeContractAsync({
        address: ADDRESSES.amm,
        abi: AMM_ABI,
        functionName: 'swap',
        args: [tokenInAddr, parseEther(amountInStr), parseEther(minAmountOutStr), deadline],
      });
      await waitForTransactionReceipt(config, { hash });
      refetchBalanceA();
      refetchBalanceB();
      refetchAllowance();
      return { success: true, hash };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    balanceA: balanceA ? formatEther(balanceA) : '0',
    balanceB: balanceB ? formatEther(balanceB) : '0',
    amountOutData,
    allowance: allowanceData || 0n,
    swap,
    approve,
  };
}
