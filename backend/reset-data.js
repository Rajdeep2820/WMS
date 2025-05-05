const mysql = require('mysql2/promise');

async function resetDatabase() {
  console.log('Starting database reset...');
  
  const params = {
    host: 'localhost',
    user: 'root',
    password: '#Sonu2005',
  };
  
  const dbName = 'weaponry_management';
  
  let connection;
  
  try {
    // Create connection without database
    connection = await mysql.createConnection(params);
    console.log('Connected to MySQL server');
    
    // Drop existing database if it exists
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`Dropped database '${dbName}' if it existed`);
    
    // Create fresh database
    await connection.query(`CREATE DATABASE ${dbName}`);
    console.log(`Created fresh database '${dbName}'`);
    
    // Use the database
    await connection.query(`USE ${dbName}`);
    console.log(`Using database '${dbName}'`);
    
    // Create tables
    console.log('Creating tables and adding data...');
    
    // Create Manufacturer table
    await connection.query(`
      CREATE TABLE Manufacturer (
        Manufacturer_ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        Country VARCHAR(100),
        Contact_Info VARCHAR(200),
        Status ENUM('Active', 'Inactive') DEFAULT 'Active'
      )
    `);
    console.log('✓ Manufacturer table created');
    
    // Insert Manufacturer data
    await connection.query(`
      INSERT INTO Manufacturer (Name, Country, Contact_Info, Status) VALUES
      ('Colt Defense', 'USA', 'contact@colt.com', 'Active'),
      ('Heckler & Koch', 'Germany', 'info@hk.com', 'Active'),
      ('FN Herstal', 'Belgium', 'info@fnherstal.com', 'Active'),
      ('Beretta', 'Italy', 'support@beretta.com', 'Active'),
      ('Glock', 'Austria', 'info@glock.com', 'Active')
    `);
    console.log('✓ Manufacturer data inserted');
    
    // Create Military_Unit table
    await connection.query(`
      CREATE TABLE Military_Unit (
        Unit_ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        Type VARCHAR(50),
        Location VARCHAR(200),
        Commanding_Officer VARCHAR(100),
        Status ENUM('Active', 'Inactive') DEFAULT 'Active'
      )
    `);
    console.log('✓ Military_Unit table created');
    
    // Insert Military_Unit data
    await connection.query(`
      INSERT INTO Military_Unit (Name, Type, Location, Commanding_Officer, Status) VALUES
      ('1st Infantry Division', 'Infantry', 'Fort Riley, KS', 'Col. John Smith', 'Active'),
      ('3rd Armored Brigade', 'Armored', 'Fort Carson, CO', 'Col. Maria Rodriguez', 'Active'),
      ('5th Special Forces Group', 'Special Forces', 'Fort Campbell, KY', 'Col. David Johnson', 'Active'),
      ('7th Marine Regiment', 'Marines', 'Camp Pendleton, CA', 'Col. Robert Williams', 'Active'),
      ('101st Airborne Division', 'Airborne', 'Fort Campbell, KY', 'Col. Michael Brown', 'Active')
    `);
    console.log('✓ Military_Unit data inserted');
    
    // Create Storage_Facility table
    await connection.query(`
      CREATE TABLE Storage_Facility (
        Facility_ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        Location VARCHAR(200),
        Capacity INT,
        Security_Level ENUM('Low', 'Medium', 'High', 'Maximum') DEFAULT 'Medium',
        Status ENUM('Active', 'Inactive', 'Under Maintenance') DEFAULT 'Active'
      )
    `);
    console.log('✓ Storage_Facility table created');
    
    // Insert Storage_Facility data
    await connection.query(`
      INSERT INTO Storage_Facility (Name, Location, Capacity, Security_Level, Status) VALUES
      ('Main Armory', 'Building A, Area 1', 1000, 'High', 'Active'),
      ('Field Armory 1', 'Building B, Area 2', 500, 'Medium', 'Active'),
      ('Special Weapons Depot', 'Secure Zone, Area 5', 300, 'Maximum', 'Active'),
      ('Emergency Armory', 'Underground Bunker, Area 3', 250, 'High', 'Active'),
      ('Training Weapons Storage', 'Training Facility, Area 4', 400, 'Low', 'Active')
    `);
    console.log('✓ Storage_Facility data inserted');
    
    // Create Weapon table
    await connection.query(`
      CREATE TABLE Weapon (
        Weapon_ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        Type VARCHAR(50) NOT NULL,
        Model VARCHAR(100),
        Serial_Number VARCHAR(50) UNIQUE,
        Manufacturer_ID INT,
        Caliber VARCHAR(50),
        Acquisition_Date DATE,
        Status ENUM('Active', 'Inactive', 'Under Maintenance') DEFAULT 'Active',
        Assigned_Unit_ID INT,
        Facility_ID INT,
        Last_Inspection_Date DATE,
        FOREIGN KEY (Manufacturer_ID) REFERENCES Manufacturer(Manufacturer_ID),
        FOREIGN KEY (Facility_ID) REFERENCES Storage_Facility(Facility_ID),
        FOREIGN KEY (Assigned_Unit_ID) REFERENCES Military_Unit(Unit_ID)
      )
    `);
    console.log('✓ Weapon table created');
    
    // Insert Weapon data
    await connection.query(`
      INSERT INTO Weapon (Name, Type, Model, Serial_Number, Manufacturer_ID, Caliber, Acquisition_Date, Status, Facility_ID, Assigned_Unit_ID, Last_Inspection_Date) VALUES
      ('M4A1 Carbine', 'Rifle', 'M4A1', 'W10001', 1, '5.56mm', '2020-01-15', 'Active', 1, 1, '2023-10-15'),
      ('M9 Beretta', 'Pistol', 'M9', 'W10002', 4, '9mm', '2019-05-20', 'Active', 1, 2, '2023-11-20'),
      ('M249 SAW', 'Machine Gun', 'M249', 'W10003', 3, '5.56mm', '2018-11-10', 'Under Maintenance', 3, NULL, '2023-09-10'),
      ('M240B', 'Machine Gun', 'M240B', 'W10004', 3, '5.56mm', '2021-03-05', 'Active', 1, 3, '2023-12-05'),
      ('Glock 19', 'Pistol', 'G19', 'W10005', 5, '9mm', '2022-02-12', 'Active', 2, 4, '2024-01-12'),
      ('MP5', 'Submachine Gun', 'MP5A3', 'W10006', 2, '9mm', '2020-07-22', 'Active', 3, 1, '2023-08-22'),
      ('M16A4', 'Rifle', 'M16A4', 'W10007', 1, '5.56mm', '2019-09-18', 'Inactive', 2, NULL, '2023-06-18'),
      ('M24 Sniper Rifle', 'Sniper Rifle', 'M24', 'W10008', 1, '7.62mm', '2021-08-30', 'Active', 3, 2, '2024-02-28'),
      ('Barrett M82', 'Sniper Rifle', 'M82A1', 'W10009', 1, '12.7mm', '2022-01-25', 'Active', 3, 3, '2024-01-25'),
      ('MK19', 'Grenade Launcher', 'MK19', 'W10010', 3, '40mm', '2020-11-15', 'Active', 1, 4, '2023-11-15')
    `);
    console.log('✓ Weapon data inserted');
    
    // Create Soldier table
    await connection.query(`
      CREATE TABLE Soldier (
        Soldier_ID INT PRIMARY KEY AUTO_INCREMENT,
        First_Name VARCHAR(50) NOT NULL,
        Last_Name VARCHAR(50) NOT NULL,
        Soldier_Rank VARCHAR(50),
        Serial_Number VARCHAR(50) UNIQUE,
        Date_of_Birth DATE,
        Join_Date DATE,
        Unit_ID INT,
        Status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
        Specialization VARCHAR(100),
        FOREIGN KEY (Unit_ID) REFERENCES Military_Unit(Unit_ID)
      )
    `);
    console.log('✓ Soldier table created');
    
    // Insert Soldier data
    await connection.query(`
      INSERT INTO Soldier (First_Name, Last_Name, Soldier_Rank, Serial_Number, Date_of_Birth, Join_Date, Unit_ID, Status, Specialization) VALUES
      ('James', 'Smith', 'Sergeant', 'S20001', '1990-05-15', '2010-07-20', 1, 'Active', 'Infantry'),
      ('Jennifer', 'Johnson', 'Lieutenant', 'S20002', '1988-10-22', '2012-03-15', 2, 'Active', 'Armor'),
      ('Michael', 'Williams', 'Corporal', 'S20003', '1992-02-18', '2014-09-10', 1, 'Active', 'Infantry'),
      ('Robert', 'Brown', 'Specialist', 'S20004', '1995-11-30', '2016-05-05', 3, 'Active', 'Special Forces'),
      ('Emily', 'Jones', 'Staff Sergeant', 'S20005', '1987-07-08', '2008-12-12', 2, 'On Leave', 'Artillery'),
      ('David', 'Miller', 'Private', 'S20006', '1998-04-25', '2020-01-10', 1, 'Active', 'Infantry'),
      ('Sarah', 'Davis', 'Captain', 'S20007', '1985-09-03', '2007-06-22', 3, 'Active', 'Intelligence'),
      ('Daniel', 'Garcia', 'Major', 'S20008', '1982-12-15', '2005-08-18', 4, 'Active', 'Marines'),
      ('Kevin', 'Rodriguez', 'Private First Class', 'S20009', '1997-03-20', '2019-11-05', 5, 'Active', 'Paratrooper'),
      ('Lisa', 'Wilson', 'Sergeant First Class', 'S20010', '1984-08-10', '2006-04-15', 4, 'Inactive', 'Combat Engineer')
    `);
    console.log('✓ Soldier data inserted');
    
    // Create Weapon_Assignment table
    await connection.query(`
      CREATE TABLE Weapon_Assignment (
        Assignment_ID INT PRIMARY KEY AUTO_INCREMENT,
        Weapon_ID INT,
        Soldier_ID INT,
        Unit_ID INT,
        Assignment_Date DATE,
        Return_Date DATE,
        Status ENUM('Active', 'Returned', 'Lost') DEFAULT 'Active',
        Notes TEXT,
        FOREIGN KEY (Weapon_ID) REFERENCES Weapon(Weapon_ID),
        FOREIGN KEY (Soldier_ID) REFERENCES Soldier(Soldier_ID),
        FOREIGN KEY (Unit_ID) REFERENCES Military_Unit(Unit_ID)
      )
    `);
    console.log('✓ Weapon_Assignment table created');
    
    // Insert Weapon_Assignment data
    await connection.query(`
      INSERT INTO Weapon_Assignment (Weapon_ID, Soldier_ID, Unit_ID, Assignment_Date, Return_Date, Status, Notes) VALUES
      (1, 1, 1, '2022-01-20', NULL, 'Active', 'Standard issue weapon'),
      (2, 3, 1, '2022-02-15', NULL, 'Active', 'Sidearm for field operations'),
      (4, 2, 2, '2022-03-10', NULL, 'Active', 'Heavy support weapon for unit operations'),
      (5, 7, 3, '2022-02-28', '2022-05-15', 'Returned', 'Temporary assignment for training'),
      (6, 4, 3, '2022-01-05', NULL, 'Active', 'Special operations weapon'),
      (8, 9, 5, '2022-04-12', NULL, 'Active', 'Designated marksman rifle'),
      (2, 6, 1, '2022-03-25', NULL, 'Active', 'Standard sidearm'),
      (9, 8, 4, '2022-02-10', NULL, 'Active', 'Long-range support'),
      (10, 5, 2, '2022-01-18', '2022-04-20', 'Returned', 'Heavy support weapon for training'),
      (7, 10, 4, '2022-03-05', '2022-05-10', 'Lost', 'Reported lost during field exercise')
    `);
    console.log('✓ Weapon_Assignment data inserted');
    
    // Create Weapon_Maintenance table
    await connection.query(`
      CREATE TABLE Weapon_Maintenance (
        Maintenance_ID INT PRIMARY KEY AUTO_INCREMENT,
        Weapon_ID INT,
        Type ENUM('Regular', 'Repair', 'Upgrade', 'Inspection') NOT NULL,
        Start_Date DATE NOT NULL,
        End_Date DATE,
        Technician VARCHAR(100),
        Status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
        Cost DECIMAL(10, 2),
        Notes TEXT,
        FOREIGN KEY (Weapon_ID) REFERENCES Weapon(Weapon_ID)
      )
    `);
    console.log('✓ Weapon_Maintenance table created');
    
    // Insert Weapon_Maintenance data
    await connection.query(`
      INSERT INTO Weapon_Maintenance (Weapon_ID, Type, Start_Date, End_Date, Technician, Status, Cost, Notes) VALUES
      (3, 'Repair', '2023-01-15', '2023-01-18', 'Robert Johnson', 'Completed', 350.75, 'Feed mechanism repair'),
      (7, 'Regular', '2023-02-10', '2023-02-12', 'Maria Garcia', 'Completed', 120.50, 'Regular cleaning and inspection'),
      (5, 'Inspection', '2023-03-05', NULL, 'David Lee', 'In Progress', NULL, 'Annual inspection'),
      (1, 'Upgrade', '2023-02-25', '2023-03-02', 'Samuel Brown', 'Completed', 550.00, 'Rail system upgrade'),
      (9, 'Repair', '2023-03-15', NULL, 'Lisa Wilson', 'Scheduled', 400.00, 'Scope alignment issue'),
      (4, 'Regular', '2023-01-20', '2023-01-22', 'Michael Taylor', 'Completed', 95.25, 'Routine maintenance'),
      (8, 'Upgrade', '2023-03-10', NULL, 'Robert Johnson', 'In Progress', 650.00, 'Barrel replacement'),
      (3, 'Inspection', '2023-03-20', NULL, 'Jessica Martinez', 'Scheduled', 150.00, 'Post-repair inspection'),
      (2, 'Regular', '2023-02-15', '2023-02-17', 'David Lee', 'Completed', 85.50, 'Cleaning and lubrication'),
      (6, 'Repair', '2023-02-28', '2023-03-05', 'Maria Garcia', 'Completed', 275.00, 'Trigger mechanism adjustment')
    `);
    console.log('✓ Weapon_Maintenance data inserted');
    
    // Create Ammunition table
    await connection.query(`
      CREATE TABLE Ammunition (
        Ammunition_ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        Type VARCHAR(50) NOT NULL,
        Caliber VARCHAR(50),
        Quantity INT DEFAULT 0,
        Manufacturer_ID INT,
        Batch_Number VARCHAR(50),
        Production_Date DATE,
        Expiration_Date DATE,
        Facility_ID INT,
        Status ENUM('Available', 'Reserved', 'Depleted', 'Expired') DEFAULT 'Available',
        FOREIGN KEY (Manufacturer_ID) REFERENCES Manufacturer(Manufacturer_ID),
        FOREIGN KEY (Facility_ID) REFERENCES Storage_Facility(Facility_ID)
      )
    `);
    console.log('✓ Ammunition table created');
    
    // Insert Ammunition data
    await connection.query(`
      INSERT INTO Ammunition (Name, Type, Caliber, Quantity, Manufacturer_ID, Facility_ID, Production_Date, Expiration_Date, Status) VALUES
      ('M855', 'Ball', '5.56mm', 10000, 1, 1, '2022-01-10', '2027-01-10', 'Available'),
      ('M193', 'Ball', '5.56mm', 8000, 3, 1, '2022-02-15', '2027-02-15', 'Available'),
      ('M80', 'Ball', '7.62mm', 5000, 3, 3, '2022-03-05', '2027-03-05', 'Available'),
      ('M882', 'Ball', '9mm', 12000, 4, 2, '2022-01-20', '2027-01-20', 'Available'),
      ('MK248', 'Match', '7.62mm', 2000, 3, 3, '2022-02-10', '2027-02-10', 'Available'),
      ('12 Gauge', 'Buckshot', '12 Gauge', 3000, 5, 2, '2022-03-15', '2027-03-15', 'Available'),
      ('M118LR', 'Match', '7.62mm', 1500, 1, 3, '2022-01-15', '2027-01-15', 'Reserved'),
      ('M67', 'Fragmentation Grenade', 'N/A', 500, 3, 3, '2022-02-25', '2025-02-25', 'Available'),
      ('M430', 'HEDP', '40mm', 800, 1, 3, '2022-03-10', '2026-03-10', 'Available'),
      ('Old Ammunition', 'Ball', '5.56mm', 1000, 1, 1, '2018-01-10', '2023-01-10', 'Expired')
    `);
    console.log('✓ Ammunition data inserted');
    
    console.log('Database reset completed successfully');
    
  } catch (error) {
    console.error('Error during database reset:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the reset
resetDatabase(); 