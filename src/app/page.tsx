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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gradient">Sui Pay</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/marketplace"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <span>Marketplace</span>
              </a>
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
    </div>
  );
}

function RemittanceApp() {
  const currentAccount = useCurrentAccount();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<RemittanceEvent[]>([]);
  const [balance, setBalance] = useState('0');

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
        
        alert('Sent successfully!');
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
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Wallet</h3>
          <p className="text-gray-600 mb-4">Connect your wallet to start sending money</p>
          <ConnectButton variant="default" size="lg" />
        </div>
      )}
    </div>
  );
} 