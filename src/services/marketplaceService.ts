import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Sui client for testnet
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// Updated Carbon Credits Package ID and Object IDs from the new deployment
const CARBON_CREDITS_PACKAGE_ID = '0x08a91e0eee53bdade76d9b4c37ceead073d249ac2870f458fc78fc366c46bd40';
const CARBON_MARKETPLACE_OBJECT_ID = '0x70bea4d3084daec70ef0d8d7e01cbff87e9d11f122aa84e13caf7a66f266e916';
const CARBON_TREASURY_OBJECT_ID = '0x42f70bac8a056e24bacc9e36eca2f415724f44d57ef9e55acaea97e729059aab';
const CARBON_REGISTRY_OBJECT_ID = '0x00fcf3c0bad36bd5ed93a29debf97e8ddb11e79f4a2b43ad3182af7805a63b17';

export interface CarbonCreditListing {
  id: string;
  project_name: string;
  project_description: string;
  project_location: string;
  verification_standard: string;
  project_type: string;
  seller: string;
  credits_amount: number;
  price_per_credit: number; // in MIST
  total_price: number; // in MIST
  is_active: boolean;
  created_at: string;
}

export interface CarbonCreditMintingData {
  project_name: string;
  project_description: string;
  project_location: string;
  verification_standard: string;
  project_type: string;
  credits_amount: number;
  price_per_credit: number;
}

export interface CarbonCreditProject {
  project_id: string;
  name: string;
  description: string;
  location: string;
  verification_standard: string;
  project_type: string;
  verification_date: number;
  expiry_date: number;
}

export interface ListCarbonCreditData {
  project_id: string;
  coin_object_id: string; // The Coin<CARBON_CREDIT> object ID
  price_per_credit: number; // in MIST
}

export class CarbonCreditsService {
  // Purchase carbon credits from treasury and then list them
  async mintAndListCarbonCredits(
    mintingData: CarbonCreditMintingData,
    signAndExecuteTransaction: any
  ): Promise<string> {
    try {
      console.log('Purchasing carbon credits from treasury:', mintingData);
      
      const txb = new Transaction();
      
      // First, purchase carbon credits from treasury
      const required_payment = mintingData.credits_amount * 100000000; // 0.1 SUI per credit
      const [payment_coin] = txb.splitCoins(txb.gas, [required_payment]);
      
      txb.moveCall({
        target: `${CARBON_CREDITS_PACKAGE_ID}::carbon_credits::purchase_carbon_credits`,
        arguments: [
          txb.object(CARBON_TREASURY_OBJECT_ID),
          payment_coin,
          txb.pure.u64(mintingData.credits_amount),
        ],
      });

      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });
      console.log('Carbon credits purchased successfully:', result);
      return result.digest;
    } catch (error) {
      console.error('Error purchasing carbon credits:', error);
      throw error;
    }
  }

  // List carbon credits on the marketplace (after purchasing from treasury)
  async listCarbonCredits(
    listingData: {
      project_name: string;
      project_description: string;
      project_location: string;
      verification_standard: string;
      project_type: string;
      credits_amount: number;
      price_per_credit: number;
      coin_object_id: string; // The Coin<CARBON_CREDIT> object ID from treasury purchase
    },
    signAndExecuteTransaction: any
  ): Promise<string> {
    try {
      console.log('Listing carbon credits on marketplace:', listingData);
      
      const txb = new Transaction();
      
      // List the carbon credits on the marketplace
      txb.moveCall({
        target: `${CARBON_CREDITS_PACKAGE_ID}::carbon_credits::list_carbon_credits`,
        arguments: [
          txb.object(CARBON_MARKETPLACE_OBJECT_ID),
          txb.object(listingData.coin_object_id), // The Coin<CARBON_CREDIT> object
          txb.pure.u64(listingData.price_per_credit), // Price per credit in MIST
          txb.pure(new Uint8Array(Buffer.from(listingData.project_name, 'utf8'))),
          txb.pure(new Uint8Array(Buffer.from(listingData.project_description, 'utf8'))),
          txb.pure(new Uint8Array(Buffer.from(listingData.project_location, 'utf8'))),
          txb.pure(new Uint8Array(Buffer.from(listingData.verification_standard, 'utf8'))),
          txb.pure(new Uint8Array(Buffer.from(listingData.project_type, 'utf8'))),
        ],
      });

      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });
      console.log('Carbon credits listed successfully:', result);
      return result.digest;
    } catch (error) {
      console.error('Error listing carbon credits:', error);
      throw error;
    }
  }

  // Buy carbon credits from marketplace
  async buyCarbonCredits(
    listing_id: string,
    payment_amount: number, // in MIST
    signAndExecuteTransaction: any
  ): Promise<string> {
    try {
      const txb = new Transaction();
      // Split the coin to the exact amount needed
      const [coin] = txb.splitCoins(txb.gas, [payment_amount]);
      txb.moveCall({
        target: `${CARBON_CREDITS_PACKAGE_ID}::carbon_credits::buy_carbon_credits`,
        arguments: [
          txb.object(CARBON_MARKETPLACE_OBJECT_ID),
          txb.pure.address(listing_id),
          coin,
        ],
      });
      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });
      console.log('Carbon credits purchased successfully:', result);
      return result.digest;
    } catch (error) {
      console.error('Error buying carbon credits:', error);
      throw error;
    }
  }

  // Get carbon credit listings from the marketplace
  async getCarbonCreditListings(): Promise<CarbonCreditListing[]> {
    try {
      // Query the marketplace object for listings
      const marketplace = await suiClient.getObject({
        id: CARBON_MARKETPLACE_OBJECT_ID,
        options: {
          showContent: true,
        },
      });

      // Parse listings from the marketplace object
      // This is a simplified approach - in a real app you'd query events or use an indexer
      return [];
    } catch (error) {
      console.error('Error fetching carbon credit listings:', error);
      return [];
    }
  }

  // Get verified projects from the registry
  async getVerifiedProjects(): Promise<CarbonCreditProject[]> {
    try {
      // Query the registry object for verified projects
      const registry = await suiClient.getObject({
        id: CARBON_REGISTRY_OBJECT_ID,
        options: {
          showContent: true,
        },
      });

      // Parse projects from the registry object
      // This is a simplified approach - in a real app you'd query events or use an indexer
      return [];
    } catch (error) {
      console.error('Error fetching verified projects:', error);
      return [];
    }
  }

  // Extract carbon credits from a listing object (for buyers)
  async extractCarbonCredits(
    listing_object_id: string,
    signAndExecuteTransaction: any
  ): Promise<string> {
    try {
      // This would be a separate function in the contract to extract coins from listing objects
      // For now, we'll assume the listing object is transferred to the buyer
      console.log('Listing object transferred to buyer:', listing_object_id);
      return listing_object_id;
    } catch (error) {
      console.error('Error extracting carbon credits:', error);
      throw error;
    }
  }
}

// Legacy marketplace service for backward compatibility
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number; // in MIST
  seller: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  isForSale: boolean;
}

export interface ListItemData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

// Package ID and Marketplace Object ID from the published contract
const MARKETPLACE_PACKAGE_ID = '0x8844b13ebf2e421e69df405fff1b0e64228391d29ef37605ddd88b327ff604de';
const MARKETPLACE_OBJECT_ID = '0xefb41ef6da023e1dc3beea5af062d97cb4cf029549f0fb3dcd9dc2f49f87a536';

export class MarketplaceService {
  private static instance: MarketplaceService;
  private suiClient: SuiClient;

  private constructor() {
    this.suiClient = suiClient;
  }

  public static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService();
    }
    return MarketplaceService.instance;
  }

  // List an item for sale
  async listItem(
    itemData: ListItemData,
    signAndExecuteTransaction: any
  ): Promise<string> {
    try {
      const txb = new Transaction();
      txb.moveCall({
        target: `${MARKETPLACE_PACKAGE_ID}::marketplace::list_item`,
        arguments: [
          txb.object(MARKETPLACE_OBJECT_ID),
          txb.pure(new Uint8Array(Buffer.from(itemData.name, 'utf8'))),
          txb.pure(new Uint8Array(Buffer.from(itemData.description, 'utf8'))),
          txb.pure.u64(itemData.price),
          txb.pure(new Uint8Array(Buffer.from(itemData.imageUrl, 'utf8'))),
          txb.pure(new Uint8Array(Buffer.from(itemData.category, 'utf8'))),
        ],
      });
      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });
      console.log('Item listed successfully:', result);
      return result.digest;
    } catch (error) {
      console.error('Error listing item:', error);
      throw error;
    }
  }

  // Buy an item
  async buyItem(
    item: MarketplaceItem,
    signAndExecuteTransaction: any
  ): Promise<string> {
    try {
      // TODO: This currently fails because mock items don't exist on the blockchain
      // Items need to be listed first through the list_item function before they can be bought
      if (item.id.startsWith('1') || item.id.startsWith('2') || item.id.startsWith('3')) {
        throw new Error('Cannot buy mock items. Please list real items first using the "List Item" button.');
      }
      
      const txb = new Transaction();
      // Split the coin to the exact amount needed
      const [coin] = txb.splitCoins(txb.gas, [item.price]);
      txb.moveCall({
        target: `${MARKETPLACE_PACKAGE_ID}::marketplace::buy_item`,
        arguments: [
          txb.object(MARKETPLACE_OBJECT_ID),
          txb.pure.address(item.id),
          coin,
        ],
      });
      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });
      console.log('Item purchased successfully:', result);
      return result.digest;
    } catch (error) {
      console.error('Error buying item:', error);
      throw error;
    }
  }

  // Remove item from sale (not implemented in contract, stub for now)
  async removeItem(
    item: MarketplaceItem,
    signAndExecuteTransaction: any
  ): Promise<string> {
    throw new Error('Remove item is not implemented in the contract.');
  }

  // Get marketplace stats (stub, TODO: implement real query)
  async getMarketplaceStats(): Promise<{ totalItems: number; totalVolume: number }> {
    // TODO: Query the contract for real stats
    return {
      totalItems: 0,
      totalVolume: 0,
    };
  }

  // Get items for sale (stub, TODO: implement real query)
  async getItemsForSale(): Promise<MarketplaceItem[]> {
    // TODO: Query the contract for real items
    // For now, return mock carbon credit items with prices 2 SUI or less
    return [
      {
        id: '1',
        name: 'Amazon Rainforest Conservation',
        description: 'Carbon credits from protecting 100 hectares of Amazon rainforest. Verified by Gold Standard. Each credit represents 1 ton of CO2 sequestered.',
        price: 1000000000, // 1 SUI in MIST
        seller: '0x1234567890abcdef1234567890abcdef12345678',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
        category: 'Forest Conservation',
        createdAt: '2024-01-15T10:30:00Z',
        isForSale: true,
      },
      {
        id: '2',
        name: 'Solar Farm Development',
        description: 'Carbon credits from a 50MW solar farm in California. Clean energy generation reducing fossil fuel dependency. Each credit represents 1 ton of CO2 avoided.',
        price: 1500000000, // 1.5 SUI in MIST
        seller: '0xabcdef1234567890abcdef1234567890abcdef12',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=300&fit=crop',
        category: 'Renewable Energy',
        createdAt: '2024-01-14T15:45:00Z',
        isForSale: true,
      },
      {
        id: '3',
        name: 'Ocean Cleanup Initiative',
        description: 'Carbon credits from ocean plastic cleanup and marine ecosystem restoration. Each credit represents 1 ton of CO2 equivalent through ocean health improvement.',
        price: 2000000000, // 2 SUI in MIST
        seller: '0x7890abcdef1234567890abcdef1234567890abcd',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop',
        category: 'Ocean Conservation',
        createdAt: '2024-01-13T09:15:00Z',
        isForSale: true,
      },
    ];
  }
} 