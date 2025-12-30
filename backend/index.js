/**
 * Load environment variables
 * - Local: .env.local
 * - Production: Cloud Run env vars
 */
require('dotenv').config({
  path: process.env.NODE_ENV === 'production'
    ? undefined           // Cloud Run / GCP
    : '.env.local'        // Local dev
});

const app = require('./src/app');
const pool = require('./src/config/db');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

/**
 * Apply global middleware
 * (Safe to keep here if not already in app.js)
 */
app.use(cors({
  origin: true,          // allow frontend origin
  credentials: true
}));

/**
 * Start server
 */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'local'}`);
});

/**
 * Graceful shutdown
 * - Closes DB pool
 * - Stops accepting new requests
 */
const shutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  try {
    await pool.end();
    console.log('✅ PostgreSQL pool closed');
  } catch (err) {
    console.error('❌ Error closing DB pool:', err);
  }

  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Force exit if shutdown hangs
  setTimeout(() => {
    console.error('⚠️ Force exiting process');
    process.exit(1);
  }, 10_000);
};

process.on('SIGINT', shutdown);   // Ctrl + C
process.on('SIGTERM', shutdown);  // Docker / Cloud Run