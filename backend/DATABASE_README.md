# Weaponry Management System - Database Setup

This document explains how to set up and manage the database for the Weaponry Management System.

## Database Schema

The database schema for the Weaponry Management System is defined in the `database.sql` file. This file contains all necessary SQL commands to:

1. Create the database
2. Create all required tables with proper relationships
3. Insert sample data
4. Set up views, triggers, and other database objects

## Setup Instructions

### Prerequisites

- MySQL Server 5.7+ installed and running
- Node.js 14+ installed

### Setting Up the Database

1. Make sure your MySQL server is running.

2. Configure your database connection by creating a `.env` file in the `backend` directory with the following content:

```
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=weaponry_management

# Server Configuration
PORT=5001

# Development Environment
NODE_ENV=development
```

3. Run the database setup script:

```bash
cd backend
npm install
node setup-database.js
```

This script will:
- Connect to your MySQL server
- Read and execute the SQL commands in the `database.sql` file
- Set up all tables, sample data, and database objects

### Database Schema Changes

If you need to make changes to the database schema:

1. Edit the `database.sql` file to add your changes.
2. Run the setup script again to apply your changes:

```bash
node setup-database.js
```

Note: This will attempt to recreate all database objects. If there are conflicts with existing data, you may need to manually modify the database or create a migration script.

## Database Structure

The database includes the following main tables:

- `Manufacturer`: Stores information about weapon manufacturers
- `Military_Unit`: Military units that use the weapons
- `Storage_Facility`: Locations where weapons and ammunition are stored
- `Weapon`: All weapon information
- `Soldier`: Personnel information
- `Weapon_Assignment`: Assignments of weapons to soldiers
- `Weapon_Maintenance`: Maintenance records for weapons
- `Ammunition`: Ammunition inventory

## Views and Triggers

The database also includes the following auxiliary objects:

- `v_weapon_details`: A view showing detailed weapon information with joins to related tables
- `v_weapon_assignments`: A view showing active weapon assignments with soldier and unit details
- `weapon_log`: A table that logs weapon operations
- Triggers for logging inserts, updates, and deletes on the Weapon table

## Troubleshooting

If you encounter any issues during database setup:

1. Check that your MySQL server is running
2. Verify your database credentials in the `.env` file
3. Check the console output for specific error messages
4. Ensure you have sufficient privileges to create databases and tables

For more help, contact the development team. 