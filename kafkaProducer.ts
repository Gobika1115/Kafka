import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'crypto-trading',
    brokers: ['localhost:9092'],
});

const producer = kafka.producer();

export const produceOrder = async (order: any) => {
    await producer.send({
        topic: 'orders',
        messages: [{ value: JSON.stringify(order) }],
    });
};

(async () => {
    await producer.connect();
})();
