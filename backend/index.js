require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 8080;



const cors = require('cors');


const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });

    /**
     * Graceful shutdown
     */
    const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    try {
        await pool.end(); // closes all DB connections
        console.log('PostgreSQL pool closed');
    } catch (err) {
        console.error('Error closing DB pool', err);
    }

    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);   // Ctrl + C
process.on('SIGTERM', shutdown);  // Docker / Cloud Run / GCP
