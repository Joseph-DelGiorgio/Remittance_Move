'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, ConnectButton } from '@mysten/dapp-kit';
import { MarketplaceCard } from '@/components/marketplace/MarketplaceCard';
import { ItemCard } from '@/components/marketplace/ItemCard';
import { QuickCarbonCreditForm } from '@/components/marketplace/QuickCarbonCreditForm';
import { Button } from '@/components/ui/Button';
import { useSuiClient } from '@mysten/dapp-kit';
import { CarbonCreditsService, CarbonCreditListing, CarbonCreditMintingData } from '@/services/marketplaceService';

// Mock data for carbon credit marketplace
const mockCarbonCredits = [
  {
    id: '1',
    project_name: 'Amazon Rainforest Conservation',
    project_description: 'Carbon credits from protecting 100 hectares of Amazon rainforest. Verified by Gold Standard. Each credit represents 1 ton of CO2 sequestered.',
    project_location: 'Brazil, Amazon Basin',
    verification_standard: 'Gold Standard',
    project_type: 'Forest Conservation',
    seller: '0x1234567890abcdef1234567890abcdef12345678',
    credits_amount: 1000,
    price_per_credit: 1000000000, // 1 SUI in MIST
    total_price: 1000000000000, // 1000 SUI in MIST
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    project_name: 'Solar Farm Development',
    project_description: 'Carbon credits from a 50MW solar farm in California. Clean energy generation reducing fossil fuel dependency. Each credit represents 1 ton of CO2 avoided.',
    project_location: 'California, USA',
    verification_standard: 'Verified Carbon Standard (VCS)',
    project_type: 'Renewable Energy',
    seller: '0xabcdef1234567890abcdef1234567890abcdef12',
    credits_amount: 500,
    price_per_credit: 1500000000, // 1.5 SUI in MIST
    total_price: 750000000000, // 750 SUI in MIST
    is_active: true,
    created_at: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    project_name: 'Ocean Cleanup Initiative',
    project_description: 'Carbon credits from ocean plastic cleanup and marine ecosystem restoration. Each credit represents 1 ton of CO2 equivalent through ocean health improvement.',
    project_location: 'Pacific Ocean',
    verification_standard: 'American Carbon Registry',
    project_type: 'Ocean Conservation',
    seller: '0x7890abcdef1234567890abcdef1234567890abcd',
    credits_amount: 2000,
    price_per_credit: 2000000000, // 2 SUI in MIST
    total_price: 4000000000000, // 2000 SUI in MIST
    is_active: true,
    created_at: '2024-01-13T09:15:00Z',
  },
];

export default function MarketplacePage() {
  const account = useCurrentAccount();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listings, setListings] = useState<CarbonCreditListing[]>(mockCarbonCredits);
  const [stats, setStats] = useState({
    totalItems: mockCarbonCredits.length,
    totalVolume: mockCarbonCredits.reduce((sum, item) => sum + item.total_price, 0),
    feePercentage: 2.5,
  });

  const carbonCreditsService = new CarbonCreditsService();

  const categories = [
    'All',
    'Forest Conservation',
    'Renewable Energy',
    'Ocean Conservation',
  ];

  const filteredListings = selectedCategory === 'All' 
    ? listings 
    : listings.filter(item => {
        const mockCategories = ['Forest Conservation', 'Renewable Energy', 'Ocean Conservation'];
        return mockCategories.includes(selectedCategory);
      });

  const handleQuickCreate = async (creditData: any) => {
    if (!account?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const digest = await carbonCreditsService.createAndListCarbonCredits(
        creditData,
        signAndExecuteTransaction,
        account.address
      );
      
      alert('Carbon credits created successfully!');
      setShowQuickCreate(false);
      
      // Add new listing to the list for demonstration
      const newListing: CarbonCreditListing = {
        id: `quick_${Date.now()}`,
        project_name: creditData.project_name,
        project_description: creditData.project_description,
        project_location: creditData.project_location,
        verification_standard: creditData.verification_standard,
        project_type: creditData.project_type,
        seller: account.address,
        credits_amount: creditData.credits_amount,
        price_per_credit: creditData.price_per_credit,
        total_price: creditData.price_per_credit * creditData.credits_amount,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      
      setListings(prev => [newListing, ...prev]);
      setStats(prev => ({ ...prev, totalItems: prev.totalItems + 1 }));
      
    } catch (error: any) {
      console.error('Error creating carbon credits:', error);
      
      if (error.message?.includes('insufficient')) {
        alert('Insufficient balance for transaction');
      } else if (error.message?.includes('gas')) {
        alert('Gas estimation failed. Please try again.');
      } else if (error.message?.includes('MoveAbort')) {
        alert('Contract execution failed. Please check your input and try again.');
      } else {
        alert('Error creating carbon credits. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCarbonCredits = async (listingId: string, totalPrice: number) => {
    if (!account?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const digest = await carbonCreditsService.buyCarbonCredits(
        listingId,
        totalPrice,
        signAndExecuteTransaction
      );
      
      alert('Carbon credits purchased successfully!');
      
      // Remove the listing from the list
      setListings(prev => prev.filter(item => item.id !== listingId));
      setStats(prev => ({ ...prev, totalItems: prev.totalItems - 1 }));
      
    } catch (error: any) {
      console.error('Error buying carbon credits:', error);
      
      if (error.message?.includes('insufficient')) {
        alert('Insufficient balance for purchase');
      } else if (error.message?.includes('gas')) {
        alert('Gas estimation failed. Please try again.');
      } else if (error.message?.includes('MoveAbort')) {
        alert('Contract execution failed. Please check your input and try again.');
      } else {
        alert('Error buying carbon credits. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gradient">Carbon Credits</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ConnectButton />
              <a
                href="/"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <span>Send Money</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Marketplace Stats */}
          <MarketplaceCard stats={stats} />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          {account && (
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setShowQuickCreate(true)}
                variant="success"
                size="lg"
                disabled={isLoading}
              >
                Create Credits
              </Button>
            </div>
          )}

          {/* Carbon Credit Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <ItemCard
                key={item.id}
                item={{
                  id: item.id,
                  name: item.project_name,
                  description: item.project_description,
                  price: item.total_price,
                  seller: item.seller,
                  imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
                  category: item.project_type,
                  createdAt: item.created_at,
                  isForSale: item.is_active,
                }}
                onBuy={handleBuyCarbonCredits}
                isLoading={isLoading}
                currentUser={account?.address}
              />
            ))}
          </div>

          {/* Quick Create Modal */}
          {showQuickCreate && (
            <QuickCarbonCreditForm
              onSubmit={handleQuickCreate}
              isLoading={isLoading}
            />
          )}

          {/* Connect Wallet Prompt */}
          {!account && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Wallet</h3>
              <p className="text-gray-600 mb-4">Connect your wallet to trade carbon credits</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 