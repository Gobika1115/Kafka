import { Kafka } from 'kafkajs';
import { poolPromise } from './db';

const kafka = new Kafka({
    clientId: 'crypto-trading',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'order-group' });

const updateBalance = async (order: any) => {
    const pool = await poolPromise;
    const { user_id, currency_symbol, order_type, quantity, price } = order;

    if (order_type === 'buy') {
        await pool.request()
            .query`UPDATE Balances SET balance = ISNULL(balance, 0) + ${quantity} WHERE user_id = ${user_id} AND currency_symbol = ${currency_symbol}`;
    } else if (order_type === 'sell') {
        await pool.request()
            .query`UPDATE Balances SET balance = ISNULL(balance, 0) - ${quantity} WHERE user_id = ${user_id} AND currency_symbol = ${currency_symbol}`;
    }
};

const handleMessage = async (message: any) => {
    const order = JSON.parse(message.value.toString());
    await updateBalance(order);
};

const run = async () => {
    const consumer = kafka.consumer({ groupId: 'order-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'orders' });
    await consumer.run({
        eachMessage: async ({ message }) => {
            await handleMessage(message);
        },
    });
};

run().catch(console.error);
