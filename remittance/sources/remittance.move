module remittance::remittance {
    use sui::coin::Coin;
    use sui::event;
    use sui::tx_context::{TxContext, sender};
    use sui::transfer;

    /// Event emitted when a remittance is sent
    struct RemittanceSentEvent has copy, drop, store {
        sender: address,
        recipient: address,
        amount: u64,
    }

    /// Send remittance (stablecoin) to a recipient
    public entry fun send_remittance<CoinType>(
        coin: Coin<CoinType>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let sender_addr = sender(ctx);
        let amount = sui::coin::value(&coin);

        // Transfer the coin to the recipient
        transfer::public_transfer(coin, recipient);

        // Emit event for off-chain notification
        event::emit(RemittanceSentEvent {
            sender: sender_addr,
            recipient,
            amount,
        });
    }
} 