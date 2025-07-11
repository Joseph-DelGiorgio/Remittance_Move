'use client';

import React, { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { TransactionBlock } from '@mysten/sui';

// Sui client for testnet
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// Package ID from the published contract
const PACKAGE_ID = '0x2e366e507933e182ce9b758df6d0d24cd50702dd2081f9737d83e09b8232fdeb';

interface RemittanceEvent {
  sender: string;
  recipient: string;
  amount: string;
  timestamp: string;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sui Remittance</h1>
          <p className="text-gray-600">Send stablecoins with zero platform fees</p>
        </header>
        <RemittanceApp />
      </div>
    </div>
  );
}

function RemittanceApp() {
  const currentAccount = useCurrentAccount();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
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
      setBalance(balance.totalBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const sendRemittance = async () => {
    if (!currentAccount?.address || !recipient || !amount) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Convert amount to MIST (1 SUI = 1,000,000,000 MIST)
      const amountInMist = Math.floor(parseFloat(amount) * 1000000000);

      // Create transaction block
      const txb = new TransactionBlock();
      
      // Split the coin to the exact amount needed
      const [coin] = txb.splitCoins(txb.gas, [amountInMist]);
      
      // Call the smart contract function
      txb.moveCall({
        target: `${PACKAGE_ID}::remittance::send_remittance`,
        arguments: [coin, txb.pure(recipient)],
        typeArguments: ['0x2::sui::SUI']
      });

      const result = await signAndExecuteTransaction.mutateAsync({
        transactionBlock: txb,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        alert('Remittance sent successfully!');
        
        // Add to events list
        const newEvent: RemittanceEvent = {
          sender: currentAccount.address,
          recipient: recipient,
          amount: amount,
          timestamp: new Date().toISOString(),
        };
        setEvents(prev => [newEvent, ...prev]);
        
        // Reset form
        setRecipient('');
        setAmount('');
        
        // Refresh balance
        fetchBalance();
      } else {
        alert('Transaction failed');
      }
    } catch (error) {
      console.error('Error sending remittance:', error);
      alert('Error sending remittance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Wallet Connection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Wallet</h2>
            {currentAccount ? (
              <div className="text-sm text-gray-600">
                <p>Connected: {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-8)}</p>
                <p>Balance: {parseInt(balance) / 1000000000} SUI</p>
              </div>
            ) : (
              <p className="text-gray-600">Connect your wallet to start</p>
            )}
          </div>
          <ConnectButton />
        </div>
      </div>

      {/* Send Remittance Form */}
      {currentAccount && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Remittance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (SUI)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.1"
                step="0.000000001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={sendRemittance}
              disabled={isLoading || !recipient || !amount}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Remittance'}
            </button>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {currentAccount && events.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">From:</span> {event.sender.slice(0, 8)}...{event.sender.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">To:</span> {event.recipient.slice(0, 8)}...{event.recipient.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Amount:</span> {event.amount} SUI
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 