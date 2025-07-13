import React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@/components/ui/ConnectButton';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface WalletCardProps {
  balance: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({ balance }) => {
  const currentAccount = useCurrentAccount();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <Card className="fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Wallet</h2>
          <ConnectButton />
        </div>
      </CardHeader>
      
      {currentAccount && (
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Connected</p>
                <p className="text-xs text-gray-500 font-mono">
                  {formatAddress(currentAccount.address)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Balance</p>
                <p className="text-lg font-bold text-primary-600">
                  {parseFloat(balance).toFixed(4)} SUI
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      )}
      
      {!currentAccount && (
        <CardBody>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect Wallet
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your wallet to start sending money
            </p>
            <ConnectButton />
          </div>
        </CardBody>
      )}
    </Card>
  );
}; 