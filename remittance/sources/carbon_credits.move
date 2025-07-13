module carbon_credits::carbon_credits {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::event;
    use sui::sui::SUI;

    // Error codes
    const EInvalidAmount: u64 = 3;
    const EInvalidMintRequest: u64 = 5;
    const EInsufficientPayment: u64 = 6;

    // CARBON_CREDIT coin type
    struct CARBON_CREDIT has drop {}

    // Carbon Credit Treasury - manages minting
    struct CarbonCreditTreasury has key, store {
        id: UID,
        mint_price_per_credit: u64,
        total_credits_minted: u64,
        total_revenue: u64,
    }

    // Carbon Credit Registry - tracks verified projects
    struct CarbonCreditRegistry has key, store {
        id: UID,
        total_projects: u64,
    }

    // Events
    struct CarbonCreditsMinted has copy, drop, store {
        treasury: address,
        recipient: address,
        amount: u64,
        total_paid: u64,
    }

    struct ProjectRegistered has copy, drop, store {
        project_id: address,
        name: vector<u8>,
        category: vector<u8>,
    }

    // Initialize treasury
    fun init(ctx: &mut TxContext) {
        let treasury = CarbonCreditTreasury {
            id: object::new(ctx),
            mint_price_per_credit: 1000000, // 1 SUI per credit
            total_credits_minted: 0,
            total_revenue: 0,
        };
        transfer::share_object(treasury);
    }

    // Initialize registry
    public entry fun init_registry(ctx: &mut TxContext) {
        let registry = CarbonCreditRegistry {
            id: object::new(ctx),
            total_projects: 0,
        };
        transfer::share_object(registry);
    }

    // Register a new project
    public entry fun register_project(
        registry: &mut CarbonCreditRegistry,
        project_id: address,
        name: vector<u8>,
        description: vector<u8>,
        category: vector<u8>,
        verification_standard: vector<u8>,
        credits_available: u64,
        ctx: &mut TxContext
    ) {
        registry.total_projects = registry.total_projects + 1;

        event::emit(ProjectRegistered {
            project_id,
            name,
            category,
        });
    }

    // Mint carbon credits from treasury
    public entry fun mint_carbon_credits(
        treasury: &mut CarbonCreditTreasury,
        treasury_cap: &mut TreasuryCap<CARBON_CREDIT>,
        payment: &mut Coin<SUI>,
        credits_amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(credits_amount > 0, EInvalidMintRequest);
        
        let required_payment = credits_amount * treasury.mint_price_per_credit;
        let payment_value = coin::value(payment);
        assert!(payment_value >= required_payment, EInsufficientPayment);

        let paid = coin::split(payment, required_payment, ctx);
        coin::destroy_zero(paid);

        treasury.total_credits_minted = treasury.total_credits_minted + credits_amount;
        treasury.total_revenue = treasury.total_revenue + required_payment;

        let minted_credits = coin::mint(treasury_cap, credits_amount, ctx);
        transfer::public_transfer(minted_credits, tx_context::sender(ctx));

        event::emit(CarbonCreditsMinted {
            treasury: object::uid_to_address(&treasury.id),
            recipient: tx_context::sender(ctx),
            amount: credits_amount,
            total_paid: required_payment,
        });
    }
} 