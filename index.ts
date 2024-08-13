import express from 'express';
import { placeOrder } from './orderService';

const app = express();
app.use(express.json());

app.post('/orders', async (req, res) => {
    const { userId, orderType, currencySymbol, price, quantity } = req.body;

    if (!userId || !orderType || !currencySymbol || !price || !quantity) {
        return res.status(400).send('Missing required fields');
    }

    try {
        await placeOrder(userId, orderType, currencySymbol, price, quantity);
        res.status(201).send('Order placed successfully');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
