const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('Starting database setup...');
    
    // Create connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '#Sonu2005',
      multipleStatements: true // Important for running multiple SQL statements
    });
    
    console.log('Connected to MySQL server');
    
    // First, drop the database if it exists
    await connection.query('DROP DATABASE IF EXISTS weaponry_management');
    console.log('Dropped existing database if it existed');
    
    // Create the database
    await connection.query('CREATE DATABASE weaponry_management');
    console.log('Created fresh database');
    
    // Use the database
    await connection.query('USE weaponry_management');
    console.log('Using database weaponry_management');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'database.sql');
    let sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Remove the DELIMITER statements and trigger definitions
    // They cause syntax issues and we can create them separately if needed
    const mainSqlPart = sqlScript.split('-- Create trigger to log weapon operations')[0];
    
    console.log(`SQL file read from ${sqlFilePath}`);
    console.log('Executing SQL script (without triggers)...');
    
    // Execute the SQL script (without triggers)
    await connection.query(mainSqlPart);
    
    console.log('Database tables and sample data created successfully');
    
  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the setup
setupDatabase(); 