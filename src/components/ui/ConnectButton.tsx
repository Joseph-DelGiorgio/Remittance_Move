import React, { useState } from 'react';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

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
  console.log('ConnectButton component rendering');
  
  const currentAccount = useCurrentAccount();
  const disconnectWallet = useDisconnectWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  console.log('Current account:', currentAccount);
  console.log('Disconnect wallet:', disconnectWallet);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1 text-sm';
      case 'md': return 'px-4 py-2 text-base';
      case 'lg': return 'px-6 py-3 text-lg';
      case 'xl': return 'px-8 py-4 text-xl';
      default: return 'px-4 py-2 text-base';
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'default': return 'connect-button';
      case 'secondary': return 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600';
      case 'success': return 'bg-green-600 text-white hover:bg-green-700 border-green-600';
      case 'warning': return 'bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-600';
      case 'error': return 'bg-red-600 text-white hover:bg-red-700 border-red-600';
      case 'ghost': return 'bg-transparent text-gray-700 hover:bg-gray-100 border-gray-300';
      case 'outline': return 'bg-white text-blue-600 hover:bg-blue-50 border-blue-600';
      default: return 'connect-button';
    }
  };

  const handleConnect = async () => {
    console.log('Connect button clicked');
    setIsConnecting(true);
    
    try {
      // Try to trigger wallet connection through window events
      console.log('Attempting to connect wallet...');
      window.dispatchEvent(new CustomEvent('sui-wallet-connect'));
      console.log('Wallet connection event dispatched');
      
      // Also try to open wallet selection dialog
      if (typeof window !== 'undefined' && (window as any).suiWallet) {
        console.log('Sui wallet detected, attempting connection');
        // This would be handled by the wallet provider
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      // Reset connecting state after a delay
      setTimeout(() => {
        setIsConnecting(false);
      }, 2000);
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnect button clicked');
    disconnectWallet.mutate();
  };

  if (currentAccount) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">
            {formatAddress(currentAccount.address)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-1 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Create a custom connect button without DappKit wrapper
  return (
    <div className="space-y-2">
      {/* Custom Connect Button */}
      <button
        onClick={handleConnect}
        className={`
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${fullWidth ? 'w-full' : ''}
          ${isConnecting ? 'opacity-75 cursor-not-allowed' : ''}
          ${className || ''}
        `}
        disabled={isConnecting}
      >
        {isConnecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
      </button>
      
      {/* Debug button */}
      <button
        onClick={() => {
          console.log('Debug button clicked');
          console.log('Current account:', currentAccount);
          console.log('Disconnect wallet:', disconnectWallet);
          console.log('Window object:', window);
          alert('Debug info logged to console');
        }}
        className="connect-button px-4 py-2 text-sm w-full"
      >
        🐛 Debug Wallet State
      </button>
    </div>
  );
}; 