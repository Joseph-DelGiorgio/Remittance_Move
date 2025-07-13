import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Sui client for testnet
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// Updated Carbon Credits Package ID and Object IDs from the new deployment
const CARBON_CREDITS_PACKAGE_ID = '0x7a1a227efae4adb8a4711f51c5a0349c5ec282f50d172696dd0db265d6b8aee9';
const CARBON_MARKETPLACE_OBJECT_ID = '0x0b5e3388a86924091a96df1f7ce9bef67019c706f75d76854a72cf16fb605b50';
const CARBON_TREASURY_OBJECT_ID = '0x61da13f1e6ec84311b1a314386bc45d4d24e81a539d2431799f3f32ec102742f';
const CARBON_REGISTRY_OBJECT_ID = '0x68710e4da522bfdb0faa1a9e2524667dc6c86b58772025807f326d86741bbfc9';

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

export interface ProjectRegistrationData {
  project_id: string; // address
  name: string;
  description: string;
  location: string;
  verification_standard: string;
  project_type: string;
  expiry_date: number;
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

export interface ListCarbonCreditData {
  project_id: string;
  coin_object_id: string; // The Coin<CARBON_CREDIT> object ID
  price_per_credit: number; // in MIST
}

export class CarbonCreditsService {
  // Add verified project to registry (for testing purposes)
  async addVerifiedProject(
    projectData: ProjectRegistrationData,
    signAndExecuteTransaction: any
  ): Promise<string> {
    try {
      console.log('Adding verified project to registry:', projectData);
      
      const txb = new Transaction();
      
      txb.moveCall({
        target: `${CARBON_CREDITS_PACKAGE_ID}::carbon_credits::add_verified_project`,
        arguments: [
          txb.object(CARBON_REGISTRY_OBJECT_ID),
          txb.pure.address(projectData.project_id),
          txb.pure.string(projectData.name),
          txb.pure.string(projectData.description),
          txb.pure.string(projectData.location),
          txb.pure.string(projectData.verification_standard),
          txb.pure.string(projectData.project_type),
          txb.pure.u64(projectData.expiry_date),
        ],
      });

      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });
      console.log('Verified project added successfully:', result);
      return result.digest;
    } catch (error) {
      console.error('Error adding verified project:', error);
      throw error;
    }
  }

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

  // Complete workflow: Register project, purchase credits, and list them
  async completeCarbonCreditWorkflow(
    projectData: ProjectRegistrationData,
    mintingData: CarbonCreditMintingData,
    signAndExecuteTransaction: any
  ): Promise<{ projectDigest: string; purchaseDigest: string; listingDigest?: string }> {
    try {
      console.log('Starting complete carbon credit workflow');
      
      // Step 1: Register the project
      console.log('Step 1: Registering project in registry');
      const projectDigest = await this.addVerifiedProject(projectData, signAndExecuteTransaction);
      
      // Step 2: Purchase carbon credits from treasury
      console.log('Step 2: Purchasing carbon credits from treasury');
      const purchaseDigest = await this.mintAndListCarbonCredits(mintingData, signAndExecuteTransaction);
      
      // Step 3: List the credits (this would require the coin object ID from the purchase)
      // For now, we'll return the digests and let the user know they can list manually
      console.log('Step 3: Project registered and credits purchased successfully');
      
      return {
        projectDigest,
        purchaseDigest,
        listingDigest: undefined // Would be set if we had the coin object ID
      };
    } catch (error) {
      console.error('Error in complete carbon credit workflow:', error);
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
      project_id: string; // The project ID (address) that must exist in registry
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
          txb.object(CARBON_REGISTRY_OBJECT_ID), // Add registry parameter
          txb.pure.address(listingData.project_id), // Project ID must exist in registry
          txb.object(listingData.coin_object_id), // The Coin<CARBON_CREDIT> object
          txb.pure.u64(listingData.price_per_credit), // Price per credit in MIST
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
          txb.pure.address(listing_id), // This should be the listing_id (seller address)
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

  // One-click carbon credit creation and listing (simplified UX)
  async createAndListCarbonCredits(
    creditData: {
      project_name: string;
      project_description: string;
      project_location: string;
      verification_standard: string;
      project_type: string;
      credits_amount: number;
      price_per_credit: number;
    },
    signAndExecuteTransaction: any,
    accountAddress: string
  ): Promise<string> {
    try {
      console.log('Creating and listing carbon credits with simplified UX:', creditData);
      
      const txb = new Transaction();
      
      // Step 1: Register the project first
      const project_id = accountAddress;
      
      txb.moveCall({
        target: `${CARBON_CREDITS_PACKAGE_ID}::carbon_credits::register_project`,
        arguments: [
          txb.object(CARBON_REGISTRY_OBJECT_ID),
          txb.pure.address(project_id),
          txb.pure.string(creditData.project_name),
          txb.pure.string(creditData.project_description),
          txb.pure.string(creditData.project_type),
          txb.pure.string(creditData.verification_standard),
          txb.pure.u64(creditData.credits_amount),
        ],
      });

      // Step 2: For now, we'll skip minting since we don't have access to the treasury cap
      // In a real implementation, the treasury cap would be owned by the deployer
      // and we would need to coordinate with them for minting
      console.log('Skipping minting step - treasury cap not available');
      
      // Note: In a production environment, you would:
      // 1. Have the treasury cap owned by a trusted party
      // 2. Use a separate transaction to mint credits
      // 3. Then list the credits using the coin object ID

      // Note: We can't list the credits in the same transaction because we need the coin object ID
      // from the minting transaction. This would require a two-step process:
      // 1. First transaction: Register project and mint credits
      // 2. Second transaction: List the credits using the coin object ID
      
      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });
      
      console.log('Project registered successfully:', result);
      return result.digest;
    } catch (error) {
      console.error('Error creating and listing carbon credits:', error);
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
          txb.pure.string(itemData.name),
          txb.pure.string(itemData.description),
          txb.pure.u64(itemData.price),
          txb.pure.string(itemData.imageUrl),
          txb.pure.string(itemData.category),
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