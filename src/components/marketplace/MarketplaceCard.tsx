import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface MarketplaceStats {
  totalItems: number;
  totalVolume: number;
  feePercentage: number;
}

interface MarketplaceCardProps {
  stats: MarketplaceStats;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ stats }) => {
  return (
    <Card className="fade-in">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Carbon Credits</h2>
      </CardHeader>
      
      <CardBody>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">Listed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(stats.totalVolume / 1000000000).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Volume</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(stats.feePercentage / 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Fee</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 