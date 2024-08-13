import { ConnectionPool } from 'mssql';

const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'localhost',
    database: 'crypto_db',
    options: {
        encrypt: true, // Use encryption
    },
};

export const poolPromise = new ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });
