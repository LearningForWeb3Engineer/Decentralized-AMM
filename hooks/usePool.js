import { useReadContract } from 'wagmi';
import { ADDRESSES, AMM_ABI } from '../contracts/config';
import { formatEther } from 'ethers';

export function usePool() {
  const { data: reserves, isLoading: reservesLoading } = useReadContract({
    address: ADDRESSES.amm,
    abi: AMM_ABI,
    functionName: 'getReserves',
  });

  const { data: price, isLoading: priceLoading } = useReadContract({
    address: ADDRESSES.amm,
    abi: AMM_ABI,
    functionName: 'getPrice',
  });

  const { data: paused } = useReadContract({
    address: ADDRESSES.amm,
    abi: AMM_ABI,
    functionName: 'paused',
  });

  const reserveA = reserves ? formatEther(reserves[0]) : '0';
  const reserveB = reserves ? formatEther(reserves[1]) : '0';
  const priceVal = price ? formatEther(price) : '0';

  return {
    reserveA,
    reserveB,
    price: priceVal,
    paused: paused || false,
    isLoading: reservesLoading || priceLoading,
  };
}
