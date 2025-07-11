module marketplace::marketplace {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::Coin;
    use sui::coin;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::sui::SUI;

    // Error codes
    const EInsufficientBalance: u64 = 0;
    const EInvalidPrice: u64 = 1;
    const EItemNotForSale: u64 = 2;
    const EItemNotFound: u64 = 3;

    // Marketplace object
    struct Marketplace has key, store {
        id: UID,
        items: Table<ID, Item>,
        item_count: u64,
        fees_collected: Balance<SUI>,
        fee_percentage: u64, // Fee in basis points (100 = 1%)
    }

    // Item object
    struct Item has key, store {
        id: UID,
        name: vector<u8>,
        description: vector<u8>,
        price: u64, // Price in MIST
        seller: address,
        is_for_sale: bool,
        image_url: vector<u8>,
        category: vector<u8>,
        created_at: u64,
    }

    // Events
    struct ItemListedEvent has copy, drop {
        item_id: ID,
        name: vector<u8>,
        price: u64,
        seller: address,
    }

    struct ItemSoldEvent has copy, drop {
        item_id: ID,
        buyer: address,
        seller: address,
        price: u64,
    }

    // Initialize marketplace
    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            items: table::new(ctx),
            item_count: 0,
            fees_collected: balance::zero(),
            fee_percentage: 250, // 2.5% fee
        };
        transfer::public_transfer(marketplace, tx_context::sender(ctx));
    }

    // List an item for sale
    public entry fun list_item(
        marketplace: &mut Marketplace,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
        image_url: vector<u8>,
        category: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(price > 0, EInvalidPrice);
        
        let item = Item {
            id: object::new(ctx),
            name,
            description,
            price,
            seller: tx_context::sender(ctx),
            is_for_sale: true,
            image_url,
            category,
            created_at: tx_context::epoch(ctx),
        };
        let item_id = object::id(&item);
        table::add(&mut marketplace.items, item_id, item);
        marketplace.item_count = marketplace.item_count + 1;

        event::emit(ItemListedEvent {
            item_id,
            name,
            price,
            seller: tx_context::sender(ctx),
        });
    }

    // Buy an item (now takes item_id)
    public entry fun buy_item(
        marketplace: &mut Marketplace,
        item_id: ID,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.items, item_id), EItemNotFound);
        let item = table::remove(&mut marketplace.items, item_id);
        let buyer = tx_context::sender(ctx);
        let payment_value = coin::value(&payment);
        assert!(item.is_for_sale, EItemNotForSale);
        assert!(payment_value >= item.price, EInsufficientBalance);

        // Calculate fees
        let fee_amount = (item.price * marketplace.fee_percentage) / 10000;
        let seller_amount = item.price - fee_amount;

        // Transfer payment to seller and fees to marketplace
        let seller_coin = coin::split(&mut payment, seller_amount, ctx);
        let fee_coin = coin::split(&mut payment, fee_amount, ctx);
        let fee_balance = coin::into_balance(fee_coin);
        balance::join(&mut marketplace.fees_collected, fee_balance);

        // Transfer item to buyer (with new UID)
        let item_for_buyer = Item {
            id: object::new(ctx),
            name: item.name,
            description: item.description,
            price: item.price,
            seller: item.seller,
            is_for_sale: false,
            image_url: item.image_url,
            category: item.category,
            created_at: item.created_at,
        };
        transfer::public_transfer(item_for_buyer, buyer);
        transfer::public_transfer(seller_coin, item.seller);
        coin::destroy_zero(payment);
        let item_id_for_event = item_id;
        let buyer_for_event = buyer;
        let seller_for_event = item.seller;
        let price_for_event = item.price;
        let Item { id, .. } = item;
        object::delete(id);
        event::emit(ItemSoldEvent {
            item_id: item_id_for_event,
            buyer: buyer_for_event,
            seller: seller_for_event,
            price: price_for_event,
        });
    }

    // Withdraw fees
    public entry fun withdraw_fees(
        marketplace: &mut Marketplace,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let fees_coin = coin::from_balance(
            balance::split(&mut marketplace.fees_collected, amount),
            ctx
        );
        transfer::public_transfer(fees_coin, tx_context::sender(ctx));
    }

    // Get marketplace stats
    public fun get_marketplace_stats(marketplace: &Marketplace): (u64, u64) {
        (marketplace.item_count, balance::value(&marketplace.fees_collected))
    }
} 