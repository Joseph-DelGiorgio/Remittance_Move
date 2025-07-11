'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { ConnectButton } from '@/components/ui/ConnectButton';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { WalletCard } from '@/components/remittance/WalletCard';
import { RemittanceForm } from '@/components/remittance/RemittanceForm';
import { TransactionHistory } from '@/components/remittance/TransactionHistory';

// Sui client for testnet
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// Package ID from the published contract
const PACKAGE_ID = '0x2e366e507933e182ce9b758df6d0d24cd50702dd2081f9737d83e09b8232fdeb';

interface RemittanceEvent {
  sender: string;
  recipient: string;
  amount: string;
  timestamp: string;
  digest?: string;
}

export default function Home() {
  console.log('Home component rendering');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Sui Remittance</h1>
                <p className="text-sm text-gray-600">Zero-fee transfers on Sui</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse-soft"></div>
                <span>Testnet</span>
              </div>
              <ConnectButton variant="default" size="lg" className="shadow-lg" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <RemittanceApp />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Built on Sui Blockchain • Zero Platform Fees • Secure Transfers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RemittanceApp() {
  const currentAccount = useCurrentAccount();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<RemittanceEvent[]>([]);
  const [balance, setBalance] = useState('0');

  console.log('RemittanceApp - Current account:', currentAccount);

  // Fetch user's SUI balance
  useEffect(() => {
    if (currentAccount?.address) {
      fetchBalance();
    }
  }, [currentAccount?.address]);

  const fetchBalance = async () => {
    if (!currentAccount?.address) return;
    try {
      const balance = await suiClient.getBalance({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI',
      });
      // Convert MIST to SUI for display (1 SUI = 1,000,000,000 MIST)
      const balanceInSui = (parseInt(balance.totalBalance) / 1000000000).toFixed(4);
      setBalance(balanceInSui);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSendRemittance = async (recipient: string, amount: string) => {
    if (!currentAccount?.address) {
      alert('Please connect your wallet first');
      return;
    }

    // Validate recipient address
    if (!recipient.startsWith('0x') || recipient.length !== 66) {
      alert('Please enter a valid Sui address (0x followed by 64 characters)');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Check if user has enough balance
    const userBalance = parseFloat(balance);
    if (amountNum > userBalance) {
      alert(`Insufficient balance. You have ${balance} SUI`);
      return;
    }

    setIsLoading(true);

    try {
      // Convert amount to MIST (1 SUI = 1,000,000,000 MIST)
      const amountInMist = Math.floor(amountNum * 1000000000);

      // Create transaction block
      const txb = new Transaction();
      
      // Split the coin to the exact amount needed
      const [coin] = txb.splitCoins(txb.gas, [amountInMist]);
      
      // Call the smart contract function
      txb.moveCall({
        target: `${PACKAGE_ID}::remittance::send_remittance`,
        arguments: [coin, txb.pure('address', recipient) as any],
        typeArguments: ['0x2::sui::SUI']
      });

      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });

      if (result) {
        console.log('Transaction successful:', result);
        
        // Add to events list immediately for better UX
        const newEvent: RemittanceEvent = {
          sender: currentAccount.address,
          recipient: recipient,
          amount: amount,
          timestamp: new Date().toISOString(),
          digest: result.digest
        };
        setEvents(prev => [newEvent, ...prev]);
        
        // Refresh balance
        setTimeout(() => {
          fetchBalance();
        }, 2000);
        
        alert('Remittance sent successfully!');
      } else {
        alert('Transaction failed');
      }
    } catch (error: any) {
      console.error('Error sending remittance:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('insufficient')) {
        alert('Insufficient balance for transaction');
      } else if (error.message?.includes('gas')) {
        alert('Gas estimation failed. Please try again.');
      } else {
        alert('Error sending remittance. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Wallet Card */}
      <WalletCard balance={balance} />

      {/* Send Remittance Form */}
      {currentAccount && (
        <RemittanceForm
          onSubmit={handleSendRemittance}
          isLoading={isLoading}
          balance={balance}
        />
      )}

      {/* Transaction History */}
      {currentAccount && (
        <TransactionHistory events={events} />
      )}

      {/* Connect Wallet Prompt */}
      {!currentAccount && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-white"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Sui Remittance
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Connect your Sui wallet to start sending zero-fee remittances to anyone, anywhere in the world.
          </p>
          
          {/* Test button to verify styling */}
          <div className="mb-6">
            <button 
              className="connect-button px-6 py-3 text-lg"
              onClick={() => console.log('Test button clicked')}
            >
              🧪 Test Button (Should be Blue)
            </button>
          </div>
          
          {/* Wallet Connection Test */}
          <div className="mb-6">
            <button 
              className="connect-button px-6 py-3 text-lg"
              onClick={() => {
                console.log('Manual wallet test clicked');
                // Try to manually trigger wallet connection
                if (typeof window !== 'undefined') {
                  // Check if any wallet is available
                  const hasSuiWallet = !!(window as any).suiWallet;
                  const hasEthosWallet = !!(window as any).ethosWallet;
                  const hasSuietWallet = !!(window as any).suietWallet;
                  
                  console.log('Available wallets:', {
                    suiWallet: hasSuiWallet,
                    ethosWallet: hasEthosWallet,
                    suietWallet: hasSuietWallet
                  });
                  
                  alert(`Available wallets:\nSui Wallet: ${hasSuiWallet}\nEthos Wallet: ${hasEthosWallet}\nSuiet Wallet: ${hasSuietWallet}`);
                }
              }}
            >
              🔍 Check Available Wallets
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-6 h-6 text-success-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Zero Fees</p>
              <p className="text-xs text-gray-500">No platform charges</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Instant</p>
              <p className="text-xs text-gray-500">Real-time transfers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-6 h-6 text-warning-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Secure</p>
              <p className="text-xs text-gray-500">Blockchain security</p>
            </div>
          </div>
          <ConnectButton variant="default" size="xl" className="shadow-xl" />
        </div>
      )}
    </div>
  );
} 