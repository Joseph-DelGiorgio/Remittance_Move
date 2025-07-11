import React from 'react';
import { ConnectButton as DappKitConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { Button } from './Button';

interface CustomConnectButtonProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
}

export const ConnectButton: React.FC<CustomConnectButtonProps> = ({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
}) => {
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnectWallet.mutate()}
          className="text-gray-600 hover:text-gray-800"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <DappKitConnectButton>
      {((props: { onClick: () => void }) => (
        <Button
          onClick={props.onClick}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          className={className}
          leftIcon={
            <svg
              className="w-4 h-4"
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
          }
        >
          Connect Wallet
        </Button>
      )) as unknown as React.ReactNode}
    </DappKitConnectButton>
  );
}; 