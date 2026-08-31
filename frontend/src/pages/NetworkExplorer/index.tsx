import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Network, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { NetworkGraph } from '../../components/shared/NetworkGraph';
import { api } from '../../services/api';
import { NetworkData } from '../../types';

export function NetworkExplorer() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'ACC-1042';
  
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await api.getNetwork(initialId);
        setNetworkData(data);
      } catch (error) {
        console.error("Failed to load network", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [initialId]);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2 bg-[#f5f4ef] rounded-lg border border-[#e6e2d8]">
          <Network className="h-6 w-6 text-[#4a3525]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3b2b20]">Network Explorer</h1>
          <p className="text-[#6b584b]">Tracing entity relationships for {initialId}</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="shrink-0 flex flex-row items-center justify-between border-b border-[#e6e2d8]">
          <CardTitle>Interactive Relationship Graph</CardTitle>
          <div className="flex gap-2">
            <span className="text-xs text-[#6b584b] bg-[#f5f4ef] border border-[#e6e2d8] px-2 py-1 rounded">Hops: 3</span>
            <span className="text-xs text-[#6b584b] bg-[#f5f4ef] border border-[#e6e2d8] px-2 py-1 rounded">Directed Flow</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 rounded-b-xl overflow-hidden">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#4a3525]" />
            </div>
          ) : networkData ? (
            <NetworkGraph data={networkData} />
          ) : (
            <div className="flex h-full items-center justify-center text-[#8c7a6b]">
              No network data found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
