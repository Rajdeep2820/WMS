-- Weaponry Management System Database Schema
-- This file contains the complete database setup including schema creation and initial data.

-- Create and use the database
CREATE DATABASE IF NOT EXISTS weaponry_management;
USE weaponry_management;

-- Create Manufacturer table
CREATE TABLE IF NOT EXISTS Manufacturer (
  Manufacturer_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Country VARCHAR(100),
  Contact_Info VARCHAR(200),
  Status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active'
);

-- Create Military_Unit table
CREATE TABLE IF NOT EXISTS Military_Unit (
  Unit_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Branch VARCHAR(100),
  Location VARCHAR(200),
  Commanding_Officer VARCHAR(100)
);

-- Create Storage_Facility table
CREATE TABLE IF NOT EXISTS Storage_Facility (
  Facility_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Location VARCHAR(200),
  Capacity INT,
  Security_Level ENUM('Low', 'Medium', 'High', 'Maximum') DEFAULT 'Medium',
  Status ENUM('Operational', 'Under Maintenance', 'Full', 'Decommissioned') DEFAULT 'Operational'
);

-- Create Weapon table
CREATE TABLE IF NOT EXISTS Weapon (
  Weapon_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Type VARCHAR(50) NOT NULL,
  Model VARCHAR(100),
  Serial_Number VARCHAR(50) UNIQUE,
  Manufacturer_ID INT,
  Caliber VARCHAR(20),
  Acquisition_Date DATE,
  Status ENUM('Active', 'Inactive', 'Under Maintenance') DEFAULT 'Active',
  Assigned_Unit_ID INT,
  Facility_ID INT,
  Last_Inspection_Date DATE,
  FOREIGN KEY (Manufacturer_ID) REFERENCES Manufacturer(Manufacturer_ID) ON DELETE SET NULL,
  FOREIGN KEY (Assigned_Unit_ID) REFERENCES Military_Unit(Unit_ID) ON DELETE SET NULL,
  FOREIGN KEY (Facility_ID) REFERENCES Storage_Facility(Facility_ID) ON DELETE SET NULL
);

-- Create Soldier table
CREATE TABLE IF NOT EXISTS Soldier (
  Soldier_ID INT PRIMARY KEY AUTO_INCREMENT,
  First_Name VARCHAR(50) NOT NULL,
  Last_Name VARCHAR(50) NOT NULL,
  `Rank` VARCHAR(50),
  Serial_Number VARCHAR(50) UNIQUE,
  Date_of_Birth DATE,
  Join_Date DATE,
  Unit_ID INT,
  Status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
  Specialization VARCHAR(100),
  FOREIGN KEY (Unit_ID) REFERENCES Military_Unit(Unit_ID)
);

-- Create Weapon_Assignment table
CREATE TABLE IF NOT EXISTS Weapon_Assignment (
  Assignment_ID INT PRIMARY KEY AUTO_INCREMENT,
  Weapon_ID INT,
  Soldier_ID INT,
  Unit_ID INT,
  Assignment_Date DATE,
  Return_Date DATE,
  Status ENUM('Active', 'Returned', 'Lost') DEFAULT 'Active',
  Notes TEXT,
  FOREIGN KEY (Weapon_ID) REFERENCES Weapon(Weapon_ID) ON DELETE CASCADE,
  FOREIGN KEY (Soldier_ID) REFERENCES Soldier(Soldier_ID) ON DELETE CASCADE,
  FOREIGN KEY (Unit_ID) REFERENCES Military_Unit(Unit_ID) ON DELETE CASCADE
);

-- Create Weapon_Maintenance table
CREATE TABLE IF NOT EXISTS Weapon_Maintenance (
  Maintenance_ID INT PRIMARY KEY AUTO_INCREMENT,
  Weapon_ID INT,
  Type ENUM('Regular', 'Repair', 'Upgrade', 'Inspection') NOT NULL,
  Start_Date DATE NOT NULL,
  End_Date DATE,
  Technician VARCHAR(100),
  Cost DECIMAL(10, 2),
  Status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  Notes TEXT,
  FOREIGN KEY (Weapon_ID) REFERENCES Weapon(Weapon_ID) ON DELETE CASCADE
);

-- Create Ammunition table
CREATE TABLE IF NOT EXISTS Ammunition (
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
  FOREIGN KEY (Manufacturer_ID) REFERENCES Manufacturer(Manufacturer_ID) ON DELETE SET NULL,
  FOREIGN KEY (Facility_ID) REFERENCES Storage_Facility(Facility_ID) ON DELETE SET NULL
);

-- Sample Data: Manufacturers
INSERT INTO Manufacturer (Name, Country, Contact_Info, Status) VALUES 
('Ordnance Factory Board', 'India', 'contact@ofb.gov.in', 'Active'),
('Bharat Dynamics Limited', 'India', 'info@bdl-india.in', 'Active'),
('Hindustan Aeronautics Limited', 'India', 'support@hal-india.co.in', 'Active'),
('Larsen & Toubro', 'India', 'defense@larsentoubro.com', 'Active');

-- Sample Data: Military Units
INSERT INTO Military_Unit (Name, Branch, Location, Commanding_Officer) VALUES 
('Para SF', 'Indian Army', 'Uttar Pradesh, India', 'Colonel Rajesh Sharma'),
('MARCOS', 'Indian Navy', 'Mumbai, India', 'Captain Vikram Singh'),
('Garud Commando Force', 'Indian Air Force', 'Gwalior, India', 'Group Captain Arjun Mehta');

-- Sample Data: Storage Facilities
INSERT INTO Storage_Facility (Name, Location, Capacity, Security_Level, Status) VALUES 
('Central Ammunition Depot', 'Pulgaon, India', 500, 'High', 'Operational'),
('Naval Armory Mumbai', 'Mumbai, India', 600, 'Maximum', 'Operational'),
('HAL Storage Unit', 'Bangalore, India', 300, 'Medium', 'Operational');

-- Sample Data: Weapons
INSERT INTO Weapon (Name, Type, Model, Manufacturer_ID, Caliber, Status, Assigned_Unit_ID, Facility_ID, Last_Inspection_Date) VALUES 
('INSAS Rifle', 'Rifle', 'INSAS 5.56', 1, '5.56mm', 'Active', 1, 1, '2024-03-10'),
('AK-203', 'Rifle', 'AK-203', 1, '7.62mm', 'Active', 1, 2, '2024-02-15'),
('Nag ATGM', 'Missile', 'Nag', 2, 'N/A', 'Active', 2, 3, '2024-01-20'),
('BrahMos', 'Missile', 'BrahMos-II', 3, 'N/A', 'Active', 3, 3, '2024-03-05'),
('MP5', 'Submachine Gun', 'MP5A3', 1, '9mm', 'Active', 1, 1, '2024-02-25'),
('T-90 Bhishma', 'Tank', 'T-90S', 2, '125mm', 'Active', 2, 2, '2024-03-01'),
('Pinaka', 'Rocket Launcher', 'Pinaka Mk-II', 3, 'N/A', 'Active', 3, 3, '2024-01-29');

-- Sample Data: Soldiers
INSERT INTO Soldier (First_Name, Last_Name, `Rank`, Serial_Number, Unit_ID, Status) VALUES 
('Arjun', 'Patel', 'Major', 'IN001', 1, 'Active'),
('Vikram', 'Rathore', 'Lieutenant', 'IN002', 2, 'Active'),
('Surya', 'Pratap', 'Captain', 'IN003', 3, 'Active'),
('Rajiv', 'Singh', 'Lieutenant', 'IN004', 1, 'Active'),
('Amit', 'Sharma', 'Major', 'IN005', 2, 'Active'),
('Deepak', 'Yadav', 'Captain', 'IN006', 3, 'Active');

-- Sample Data: Weapon Assignments
INSERT INTO Weapon_Assignment (Soldier_ID, Weapon_ID, Unit_ID, Assignment_Date, Status) VALUES 
(1, 1, 1, '2024-01-15', 'Active'),
(2, 2, 2, '2024-01-20', 'Active'),
(3, 4, 3, '2024-02-05', 'Active'),
(4, 5, 1, '2024-02-10', 'Active'),
(5, 6, 2, '2024-02-15', 'Active'),
(6, 7, 3, '2024-02-20', 'Active');

-- Sample Data: Weapon Maintenance
INSERT INTO Weapon_Maintenance (Weapon_ID, Type, Start_Date, Technician, Status) VALUES 
(1, 'Regular', '2024-03-01', 'Ramesh Verma', 'In Progress'),
(2, 'Repair', '2024-02-10', 'Sandeep Mishra', 'Completed');

-- Sample Data: Ammunition
INSERT INTO Ammunition (Name, Type, Caliber, Quantity, Manufacturer_ID, Production_Date, Expiration_Date, Facility_ID, Status) VALUES 
('Standard 5.56', '5.56 NATO', '5.56mm', 1200, 1, '2023-05-10', '2027-05-10', 1, 'Available'),
('AK Rounds', '7.62×39mm', '7.62mm', 900, 2, '2023-02-15', '2028-02-15', 2, 'Available'),
('MP5 Rounds', '9mm Parabellum', '9mm', 1500, 1, '2023-08-21', '2029-08-21', 1, 'Available'),
('Tank Shells', '125mm APFSDS', '125mm', 300, 2, '2023-04-12', '2030-04-12', 2, 'Available'),
('Pinaka Rockets', '122mm Rockets', 'N/A', 200, 3, '2023-06-30', '2031-06-30', 3, 'Available');

-- Create views for common queries
CREATE OR REPLACE VIEW v_weapon_details AS
SELECT
  w.Weapon_ID,
  w.Name AS Weapon_Name,
  w.Type,
  w.Model,
  w.Caliber,
  w.Status,
  m.Name AS Manufacturer,
  mu.Name AS Assigned_Unit,
  sf.Name AS Facility_Name,
  w.Last_Inspection_Date
FROM Weapon w
LEFT JOIN Manufacturer m ON w.Manufacturer_ID = m.Manufacturer_ID
LEFT JOIN Military_Unit mu ON w.Assigned_Unit_ID = mu.Unit_ID
LEFT JOIN Storage_Facility sf ON w.Facility_ID = sf.Facility_ID;

CREATE OR REPLACE VIEW v_weapon_assignments AS
SELECT
  wa.Assignment_ID,
  CONCAT(s.First_Name, ' ', s.Last_Name) AS Soldier_Name,
  s.`Rank` AS Soldier_Rank,
  mu.Name AS Unit_Name,
  w.Name AS Weapon_Name,
  w.Type,
  w.Caliber,
  wa.Assignment_Date,
  wa.Status
FROM Weapon_Assignment wa
JOIN Soldier s ON wa.Soldier_ID = s.Soldier_ID
JOIN Weapon w ON wa.Weapon_ID = w.Weapon_ID
JOIN Military_Unit mu ON s.Unit_ID = mu.Unit_ID;

-- Create logging table for weapon operations
CREATE TABLE IF NOT EXISTS weapon_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  weapon_id INT,
  operation VARCHAR(20),
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to log weapon operations
DELIMITER $$
CREATE TRIGGER log_weapon_insert
AFTER INSERT ON Weapon
FOR EACH ROW
BEGIN
  INSERT INTO weapon_log (weapon_id, operation, details)
  VALUES (
    NEW.Weapon_ID,
    'INSERT',
    CONCAT('New weapon added: ', NEW.Name, ' (', NEW.Type, ')')
  );
END$$

CREATE TRIGGER log_weapon_update
AFTER UPDATE ON Weapon
FOR EACH ROW
BEGIN
  INSERT INTO weapon_log (weapon_id, operation, details)
  VALUES (
    NEW.Weapon_ID,
    'UPDATE',
    CONCAT('Weapon updated: ', NEW.Name, ' - Status changed from ', OLD.Status, ' to ', NEW.Status)
  );
END$$

CREATE TRIGGER log_weapon_delete
BEFORE DELETE ON Weapon
FOR EACH ROW
BEGIN
  INSERT INTO weapon_log (weapon_id, operation, details)
  VALUES (
    OLD.Weapon_ID,
    'DELETE',
    CONCAT('Weapon deleted: ', OLD.Name, ' (', OLD.Type, ')')
  );
END$$
DELIMITER ; 