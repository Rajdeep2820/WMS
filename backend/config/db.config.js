const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '#Sonu2005',
  database: process.env.DB_NAME || 'weaponry_management'
};

console.log('Database connection config:', { 
  host: config.host, 
  user: config.user, 
  database: config.database,
  password: '****' // Mask password in logs
});

// Create a connection pool
const pool = mysql.createPool(config);

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    
    // Get list of tables for verification
    const [rows] = await pool.query('SHOW TABLES');
    console.log('Available tables:', rows.map(row => Object.values(row)[0]));
    
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Make sure to run "node setup-database.js" to set up the database');
  }
})();

module.exports = pool; 