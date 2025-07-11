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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Carbon Credit Marketplace</h2>
            <p className="text-sm text-gray-600">Trade tokenized carbon credits on Sui</p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">Credits Listed</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">
              {(stats.totalVolume / 1000000000).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Volume (SUI)</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {(stats.feePercentage / 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Platform Fee</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-100 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              Verified Carbon Credits
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            All carbon credits are verified and audited for environmental impact
          </p>
        </div>
      </CardBody>
    </Card>
  );
}; 