import React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@/components/ui/ConnectButton';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface WalletCardProps {
  balance: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({ balance }) => {
  const currentAccount = useCurrentAccount();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatBalance = (balance: string) => {
    return (parseInt(balance) / 1000000000).toFixed(4);
  };

  return (
    <Card className="fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Wallet</h2>
              <p className="text-sm text-gray-600">Manage your Sui wallet</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </CardHeader>
      
      {currentAccount && (
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Connected</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {formatAddress(currentAccount.address)}
                  </p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Balance</p>
                  <p className="text-lg font-bold text-primary-600">
                    {formatBalance(balance)} SUI
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-sm font-medium text-gray-900">
                  ~${(parseFloat(formatBalance(balance)) * 0.5).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      )}
      
      {!currentAccount && (
        <CardBody>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your Sui wallet to start sending remittances
            </p>
            <ConnectButton />
          </div>
        </CardBody>
      )}
    </Card>
  );
}; 