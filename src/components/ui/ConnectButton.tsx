import React from 'react';
import { ConnectButton as DappKitConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

interface CustomConnectButtonProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
}

export const ConnectButton: React.FC<CustomConnectButtonProps> = ({
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  className,
}) => {
  console.log('ConnectButton component rendering');
  
  const currentAccount = useCurrentAccount();
  const disconnectWallet = useDisconnectWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (currentAccount) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(currentAccount.address)}
          </span>
        </div>
        <button
          onClick={() => disconnectWallet.mutate()}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Simple styled button that wraps the dapp-kit ConnectButton
  return (
    <DappKitConnectButton>
      <button
        className={`px-6 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-semibold shadow-sm ${className || ''}`}
      >
        Connect Wallet
      </button>
    </DappKitConnectButton>
  );
}; 