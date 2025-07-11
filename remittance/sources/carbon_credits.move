module carbon_credits::carbon_credits {
    use sui::coin::{Self, Coin};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::sui::SUI;

    // Error codes
    const EInvalidProject: u64 = 0;
    const EInsufficientCredits: u64 = 1;
    const EProjectNotVerified: u64 = 2;
    const EInvalidAmount: u64 = 3;
    const EInvalidListing: u64 = 4;
    const EInvalidMintRequest: u64 = 5;
    const EInsufficientPayment: u64 = 6;

    // Carbon Credit coin type
    struct CARBON_CREDIT has store, drop {}

    // Carbon Credit Treasury - manages minting
    struct CarbonCreditTreasury has key, store {
        id: UID,
        mint_price_per_credit: u64, // Price in MIST to mint 1 credit
        total_credits_minted: u64,
        total_revenue: u64,
    }

    // Carbon Credit Registry
    struct CarbonCreditRegistry has key, store {
        id: UID,
        verified_projects: Table<address, VerifiedProject>,
        total_credits_listed: u64,
        total_credits_retired: u64,
    }

    // Verified Project
    struct VerifiedProject has store {
        project_id: address,
        name: vector<u8>,
        description: vector<u8>,
        location: vector<u8>,
        verification_standard: vector<u8>, // e.g., "Gold Standard", "VCS", "CDM"
        project_type: vector<u8>, // e.g., "Forest Conservation", "Renewable Energy"
        verification_date: u64,
        expiry_date: u64,
    }

    // Carbon Credit Marketplace
    struct CarbonMarketplace has key, store {
        id: UID,
        listings: Table<address, Listing>,
        total_volume: u64,
        fee_percentage: u64, // Fee in basis points (100 = 1%)
        fees_collected: u64,
    }

    // Carbon Credit Listing
    struct Listing has key, store {
        id: UID,
        project_id: address,
        seller: address,
        coin: Coin<CARBON_CREDIT>,
        price_per_credit: u64, // Price in MIST
        total_price: u64,
        is_active: bool,
        created_at: u64,
    }

    // Events
    struct CarbonCreditsListedEvent has copy, drop {
        listing_id: address,
        project_id: address,
        seller: address,
        credits_amount: u64,
        price_per_credit: u64,
    }

    struct CarbonCreditsTradedEvent has copy, drop {
        listing_id: address,
        buyer: address,
        seller: address,
        credits_amount: u64,
        total_price: u64,
    }

    struct CarbonCreditsMintedEvent has copy, drop {
        minter: address,
        credits_amount: u64,
        total_payment: u64,
    }

    // Initialize carbon credit treasury
    public entry fun init_treasury(ctx: &mut TxContext) {
        let treasury = CarbonCreditTreasury {
            id: object::new(ctx),
            mint_price_per_credit: 100000000, // 0.1 SUI per credit
            total_credits_minted: 0,
            total_revenue: 0,
        };
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }

    // Initialize carbon credit registry
    public entry fun init_registry(ctx: &mut TxContext) {
        let registry = CarbonCreditRegistry {
            id: object::new(ctx),
            verified_projects: table::new(ctx),
            total_credits_listed: 0,
            total_credits_retired: 0,
        };
        transfer::public_transfer(registry, tx_context::sender(ctx));
    }

    // Initialize carbon marketplace
    public entry fun init_marketplace(ctx: &mut TxContext) {
        let marketplace = CarbonMarketplace {
            id: object::new(ctx),
            listings: table::new(ctx),
            total_volume: 0,
            fee_percentage: 250, // 2.5% fee
            fees_collected: 0,
        };
        transfer::public_transfer(marketplace, tx_context::sender(ctx));
    }

    // Purchase carbon credits from treasury (simplified version)
    public entry fun purchase_carbon_credits(
        treasury: &mut CarbonCreditTreasury,
        payment: Coin<SUI>,
        credits_amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(credits_amount > 0, EInvalidMintRequest);
        
        let required_payment = credits_amount * treasury.mint_price_per_credit;
        let payment_value = sui::coin::value(&payment);
        assert!(payment_value >= required_payment, EInsufficientPayment);

        // For now, we'll just accept the payment and update stats
        // In a real implementation, you would mint actual carbon credits
        treasury.total_credits_minted = treasury.total_credits_minted + credits_amount;
        treasury.total_revenue = treasury.total_revenue + required_payment;

        // Transfer payment to treasury
        transfer::public_transfer(payment, tx_context::sender(ctx));

        event::emit(CarbonCreditsMintedEvent {
            minter: tx_context::sender(ctx),
            credits_amount,
            total_payment: required_payment,
        });
    }

    // Add verified project (only callable by registry owner)
    public entry fun add_verified_project(
        registry: &mut CarbonCreditRegistry,
        project_id: address,
        name: vector<u8>,
        description: vector<u8>,
        location: vector<u8>,
        verification_standard: vector<u8>,
        project_type: vector<u8>,
        expiry_date: u64,
        ctx: &mut TxContext
    ) {
        let project = VerifiedProject {
            project_id,
            name,
            description,
            location,
            verification_standard,
            project_type,
            verification_date: tx_context::epoch(ctx),
            expiry_date,
        };
        table::add(&mut registry.verified_projects, project_id, project);
    }

    // List carbon credits for sale (seller provides Coin<CARBON_CREDIT>)
    public entry fun list_carbon_credits(
        marketplace: &mut CarbonMarketplace,
        registry: &CarbonCreditRegistry,
        project_id: address,
        coin: Coin<CARBON_CREDIT>,
        price_per_credit: u64,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&registry.verified_projects, project_id), EInvalidProject);
        assert!(price_per_credit > 0, EInvalidAmount);

        let credits_amount = sui::coin::value(&coin);
        let total_price = credits_amount * price_per_credit;
        let listing_id = tx_context::sender(ctx);
        let listing = Listing {
            id: object::new(ctx),
            project_id,
            seller: tx_context::sender(ctx),
            coin,
            price_per_credit,
            total_price,
            is_active: true,
            created_at: tx_context::epoch(ctx),
        };
        table::add(&mut marketplace.listings, listing_id, listing);

        event::emit(CarbonCreditsListedEvent {
            listing_id,
            project_id,
            seller: tx_context::sender(ctx),
            credits_amount,
            price_per_credit,
        });
    }

    // Buy carbon credits from marketplace
    public entry fun buy_carbon_credits(
        marketplace: &mut CarbonMarketplace,
        listing_id: address,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.listings, listing_id), EInvalidListing);
        let listing = table::remove(&mut marketplace.listings, listing_id);
        assert!(listing.is_active, EInvalidListing);

        let buyer = tx_context::sender(ctx);
        let payment_value = sui::coin::value(&payment);
        assert!(payment_value >= listing.total_price, EInsufficientCredits);

        // Calculate fees
        let fee_amount = (listing.total_price * marketplace.fee_percentage) / 10000;
        let seller_amount = listing.total_price - fee_amount;

        // Transfer payment
        let seller_coin = sui::coin::split(&mut payment, seller_amount, ctx);
        let _fee_coin = sui::coin::split(&mut payment, fee_amount, ctx);

        // Transfer to seller and marketplace
        transfer::public_transfer(seller_coin, listing.seller);
        marketplace.fees_collected = marketplace.fees_collected + fee_amount;
        marketplace.total_volume = marketplace.total_volume + listing.total_price;

        let credits_amount = sui::coin::value(&listing.coin);
        let seller = listing.seller;
        let total_price = listing.total_price;
        // Transfer the listing object (with coin) to the buyer
        transfer::public_transfer(listing, buyer);

        // Clean up
        sui::coin::destroy_zero(_fee_coin);
        sui::coin::destroy_zero(payment);

        event::emit(CarbonCreditsTradedEvent {
            listing_id,
            buyer,
            seller,
            credits_amount,
            total_price,
        });
    }

    // Get registry stats
    public fun get_registry_stats(registry: &CarbonCreditRegistry): (u64, u64) {
        (registry.total_credits_listed, registry.total_credits_retired)
    }

    // Get marketplace stats
    public fun get_marketplace_stats(marketplace: &CarbonMarketplace): (u64, u64) {
        (marketplace.total_volume, marketplace.fees_collected)
    }

    // Get treasury stats
    public fun get_treasury_stats(treasury: &CarbonCreditTreasury): (u64, u64, u64) {
        (treasury.mint_price_per_credit, treasury.total_credits_minted, treasury.total_revenue)
    }

    // Get project info
    public fun get_project_info(registry: &CarbonCreditRegistry, project_id: address): (vector<u8>, vector<u8>) {
        assert!(table::contains(&registry.verified_projects, project_id), EInvalidProject);
        let project = table::borrow(&registry.verified_projects, project_id);
        (project.name, project.project_type)
    }
} 