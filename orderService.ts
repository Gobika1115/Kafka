import { poolPromise } from './db.js';
import { produceOrder } from './kafkaProducer.js';

export const placeOrder = async (userId: number, orderType: 'buy' | 'sell', currencySymbol: string, price: number, quantity: number) => {
    const pool = await poolPromise;
    
    await pool.request()
        .input('user_id', userId)
        .input('order_type', orderType)
        .input('currency_symbol', currencySymbol)
        .input('price', price)
        .input('quantity', quantity)
        .input('status', 'open')
        .query`INSERT INTO Orders (user_id, order_type, currency_symbol, price, quantity, status) VALUES (@user_id, @order_type, @currency_symbol, @price, @quantity, @status)`;

    await produceOrder({ user_id: userId, order_type: orderType, currency_symbol: currencySymbol, price, quantity });
};
