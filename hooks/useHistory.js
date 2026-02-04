import { useEffect, useState } from 'react';
import { useConfig } from 'wagmi';
import { getPublicClient } from '@wagmi/core';
import { ADDRESSES, AMM_ABI } from '../contracts/config';

const SWAP_EVENT = AMM_ABI.find(item => item.name === 'Swap' && item.type === 'event');
const LP_ADDED_EVENT = AMM_ABI.find(item => item.name === 'LiquidityAdded' && item.type === 'event');
const LP_REMOVED_EVENT = AMM_ABI.find(item => item.name === 'LiquidityRemoved' && item.type === 'event');

export function useHistory() {
  const config = useConfig();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const publicClient = getPublicClient(config);
    if (!publicClient) return;

    async function fetchEvents() {
      try {
        // Get current block and query last 10000 blocks (RPC limit is usually 1000-10000)
        // RPC limit: max 1000 blocks per request
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > 900n ? currentBlock - 900n : 0n;

        const [swaps, added, removed] = await Promise.all([
          publicClient.getLogs({ address: ADDRESSES.amm, event: SWAP_EVENT, fromBlock }),
          publicClient.getLogs({ address: ADDRESSES.amm, event: LP_ADDED_EVENT, fromBlock }),
          publicClient.getLogs({ address: ADDRESSES.amm, event: LP_REMOVED_EVENT, fromBlock }),
        ]);

        const all = [
          ...(swaps || []).map(e => ({ ...e, eventType: 'Swap' })),
          ...(added || []).map(e => ({ ...e, eventType: 'Add Liquidity' })),
          ...(removed || []).map(e => ({ ...e, eventType: 'Remove Liquidity' })),
        ].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

        setEvents(all);
      } catch (e) {
        console.error('Failed to fetch events:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [config]);

  return { events, isLoading };
}
