'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { MarketplaceCard } from '@/components/marketplace/MarketplaceCard';
import { ItemCard } from '@/components/marketplace/ItemCard';
import { ListItemForm } from '@/components/marketplace/ListItemForm';
import { CarbonCreditsInfo } from '@/components/marketplace/CarbonCreditsInfo';
import { CarbonCreditsHelp } from '@/components/marketplace/CarbonCreditsHelp';
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
  const [showListForm, setShowListForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
    'Waste Management',
    'Sustainable Agriculture',
    'Clean Technology',
    'Carbon Capture',
  ];

  const filteredListings = selectedCategory === 'All' 
    ? listings 
    : listings.filter(item => {
        // For now, we'll use mock data categories
        const mockCategories = ['Forest Conservation', 'Renewable Energy', 'Ocean Conservation'];
        return mockCategories.includes(selectedCategory);
      });

  const handleListCarbonCredits = async (mintingData: CarbonCreditMintingData) => {
    if (!account?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Purchasing carbon credits with real transaction:', mintingData);
      
      // Call the carbon credits service to purchase from treasury
      const digest = await carbonCreditsService.mintAndListCarbonCredits(
        mintingData,
        signAndExecuteTransaction
      );
      
      console.log('Transaction submitted:', digest);
      
      // Show success message with next steps
      const successMessage = 
        '✅ Carbon credits purchased successfully from treasury!\n\n' +
        'Transaction Digest: ' + digest + '\n\n' +
        'Next Steps:\n' +
        '1. Check your wallet for CARBON_CREDIT coins\n' +
        '2. Use the "List for Sale" button to list your credits\n' +
        '3. Set your desired price per credit\n\n' +
        'Note: You now have ' + mintingData.credits_amount + ' carbon credits that you can list for sale.\n\n' +
        'Current Limitation: To list credits for sale, the project must be registered in the registry first. ' +
        'For now, you can purchase credits from the treasury, but listing them requires additional setup.';
      
      alert(successMessage);
      
      // Add new listing to the list for demonstration (marked as real)
      const newListing: CarbonCreditListing = {
        id: `real_${Date.now()}`, // Mark as real listing
        project_name: mintingData.project_name,
        project_description: mintingData.project_description,
        project_location: mintingData.project_location,
        verification_standard: mintingData.verification_standard,
        project_type: mintingData.project_type,
        seller: account.address,
        credits_amount: mintingData.credits_amount,
        price_per_credit: mintingData.price_per_credit,
        total_price: mintingData.price_per_credit * mintingData.credits_amount,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      
      setListings(prev => [newListing, ...prev]);
      setStats(prev => ({ ...prev, totalItems: prev.totalItems + 1 }));
      setShowListForm(false);
      
    } catch (error: any) {
      console.error('Error purchasing carbon credits:', error);
      
      // Provide specific error messages
      if (error.message?.includes('insufficient')) {
        alert('Insufficient balance for transaction. You need at least ' + 
              (mintingData.credits_amount * 0.1).toFixed(2) + ' SUI to purchase ' + 
              mintingData.credits_amount + ' carbon credits.');
      } else if (error.message?.includes('gas')) {
        alert('Gas estimation failed. Please try again.');
      } else if (error.message?.includes('MoveAbort')) {
        alert('Contract execution failed. This listing may not exist on the blockchain or may have already been sold.');
      } else if (error.message?.includes('TypeMismatch')) {
        alert('Contract error: Type mismatch. This listing may not exist on the blockchain.\n\nNote: Only real listings created through the "List Carbon Credits" button can be purchased.');
      } else if (error.message?.includes('User rejected')) {
        alert('Transaction was rejected by the user.\n\nThis means the wallet popup appeared but you clicked "Reject" or "Cancel".\n\nTo complete the purchase:\n1. Click "Buy Now" again\n2. Approve the transaction in your wallet popup\n3. Wait for the transaction to complete');
      } else {
        alert('Error purchasing carbon credits. Please try again.\n\nNote: Only real listings created through the "List Carbon Credits" button can be purchased.');
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
      console.log('Buying carbon credits with real transaction:', listingId, 'for', totalPrice, 'MIST');
      
      // Check if this is a mock listing (starts with a number)
      if (listingId.match(/^\d+$/)) {
        alert(
          '⚠️ This is a demo listing for demonstration purposes.\n\n' +
          'Demo listings cannot be purchased on the blockchain.\n\n' +
          'To buy real carbon credits:\n' +
          '1. First purchase carbon credits from the treasury using "List Carbon Credits"\n' +
          '2. Then list them for sale with real blockchain transactions\n' +
          '3. Other users can then buy your listed credits\n\n' +
          'Real listings will have a "Buy Now" button instead of "Demo Buy".'
        );
        return;
      }
      
      // Find the listing
      const listing = listings.find(l => l.id === listingId);
      if (!listing) {
        throw new Error('Carbon credit listing not found');
      }
      
      // For real listings, we need to use the seller address as the listing_id
      // since that's how the contract stores listings
      const listing_id = listing.seller;
      
      console.log('Using listing_id (seller address):', listing_id);
      
      // Call the carbon credits service
      const digest = await carbonCreditsService.buyCarbonCredits(
        listing_id, // Use seller address as listing_id
        totalPrice,
        signAndExecuteTransaction
      );
      
      console.log('Purchase successful:', digest);
      
      // Update listing status
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, is_active: false }
          : listing
      ));
      
      setStats(prev => ({ 
        ...prev, 
        totalVolume: prev.totalVolume + totalPrice 
      }));
      
      alert('✅ Carbon credits purchased successfully!\n\nTransaction: ' + digest + '\n\nYou now have the carbon credit tokens in your wallet.');
    } catch (error: any) {
      console.error('Error buying carbon credits:', error);
      
      // Provide specific error messages
      if (error.message?.includes('insufficient')) {
        alert('Insufficient balance for purchase');
      } else if (error.message?.includes('gas')) {
        alert('Gas estimation failed. Please try again.');
      } else if (error.message?.includes('MoveAbort')) {
        alert('Contract execution failed. This listing may not exist on the blockchain or may have already been sold.');
      } else if (error.message?.includes('TypeMismatch')) {
        alert('Contract error: Type mismatch. This listing may not exist on the blockchain.\n\nNote: Only real listings created through the "List Carbon Credits" button can be purchased.');
      } else if (error.message?.includes('User rejected')) {
        alert('Transaction was rejected by the user.\n\nThis means the wallet popup appeared but you clicked "Reject" or "Cancel".\n\nTo complete the purchase:\n1. Click "Buy Now" again\n2. Approve the transaction in your wallet popup\n3. Wait for the transaction to complete');
      } else {
        alert('Error purchasing carbon credits. Please try again.\n\nNote: Only real listings created through the "List Carbon Credits" button can be purchased.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-4xl font-bold text-green-900 mb-2">
                  Carbon Credit Marketplace
                </h1>
                <p className="text-lg text-green-700">
                  Trade tokenized carbon credits on Sui blockchain
                </p>
              </div>
              
              <a
                href="/"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
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
                <span>Remittance</span>
              </a>
            </div>
            
            {account?.address && (
              <div className="flex space-x-3">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => setShowListForm(!showListForm)}
                >
                  {showListForm ? 'Cancel' : 'List Carbon Credits'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  {showHelp ? 'Hide Help' : 'Show Help'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Note about current functionality */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">Live Carbon Credit Marketplace</span>
            </div>
            <p className="text-green-700 mt-2">
              This is a fully functional carbon credit marketplace on Sui blockchain. You can purchase carbon credits 
              from the treasury (0.1 SUI per credit) and then list them for sale. The contract includes a treasury, 
              registry, and marketplace with real transaction functionality.
            </p>
            <div className="mt-3 text-sm text-green-600">
              <p><strong>✅ Currently Working:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Purchase carbon credits from treasury (0.1 SUI per credit)</li>
                <li>Wallet integration and transaction signing</li>
                <li>Real blockchain transactions</li>
                <li>Demo vs real listing distinction</li>
              </ul>
              <p className="mt-2"><strong>How to create real listings:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-1">
                <li>Click "List Carbon Credits" to purchase credits from treasury</li>
                <li>Complete the form with your project details</li>
                <li>Pay 0.1 SUI per credit to the treasury</li>
                <li>Your credits will appear as real listings that can be purchased</li>
              </ol>
              <p className="mt-2 text-orange-600">
                <strong>Note:</strong> Currently, the contract requires projects to be pre-registered in the registry. 
                For now, you can purchase credits from the treasury, but listing them requires additional setup.
              </p>
            </div>
          </div>
        </div>

        {/* Carbon Credits Info */}
        <CarbonCreditsInfo />

        {/* Help Section */}
        {showHelp && (
          <div className="mb-8">
            <CarbonCreditsHelp />
          </div>
        )}

        {/* Stats Card */}
        <div className="mb-8">
          <MarketplaceCard stats={stats} />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* List Form */}
        {showListForm && (
          <div className="mb-8">
            <ListItemForm
              onSubmit={handleListCarbonCredits}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ItemCard
              key={listing.id}
              item={{
                id: listing.id,
                name: listing.project_name,
                description: listing.project_description,
                price: listing.total_price,
                seller: listing.seller,
                imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
                category: listing.project_type,
                createdAt: listing.created_at,
                isForSale: listing.is_active,
              }}
              onBuy={handleBuyCarbonCredits}
              onRemove={() => {}} // Not implemented for carbon credits
              isLoading={isLoading}
            />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No carbon credit listings found for {selectedCategory}.
            </div>
            <p className="text-gray-400 mt-2">
              Be the first to list carbon credits in this category!
            </p>
          </div>
        )}

        {/* Note about mock listings */}
        {filteredListings.length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-yellow-800 font-medium">Demo vs Real Listings</span>
            </div>
            <div className="text-yellow-700 text-sm space-y-2">
              <p>
                <strong>Demo Listings:</strong> The listings with "Demo" badges are examples that cannot be purchased on the blockchain. 
                They show what real listings look like but are for demonstration only.
              </p>
              <p>
                <strong>Real Listings:</strong> Listings created by users through the "List Carbon Credits" button can be purchased 
                with real blockchain transactions. These will have "Buy Now" buttons instead of "Demo Buy".
              </p>
              <p className="font-medium">
                To create your own real listings, use the "List Carbon Credits" button above!
              </p>
              <p className="text-orange-600 mt-2">
                <strong>Current Limitation:</strong> The contract requires projects to be pre-registered in the registry before 
                they can be listed. For now, you can purchase credits from the treasury, but listing them requires the project 
                to be added to the registry first.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 