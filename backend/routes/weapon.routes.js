const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Debug route to check table structure
router.get('/debug/schema', async (req, res) => {
  try {
    // Get table schema
    const [columnsInfo] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'weaponry_management' 
      AND TABLE_NAME = 'Weapon'
    `);
    
    console.log('Weapon table schema:', columnsInfo);
    
    // Test date formatting
    const testDate = new Date().toISOString();
    const formattedDate = testDate.split('T')[0];
    
    console.log('Original date:', testDate);
    console.log('Formatted date for MySQL:', formattedDate);
    
    // Test SQL query construction
    const sql = `
      UPDATE Weapon SET 
        Last_Inspection_Date = ?,
        Facility_ID = ?
      WHERE Weapon_ID = 1
    `;
    
    console.log('SQL query:', sql);
    console.log('With values:', [formattedDate, 1]);
    
    res.json({
      schema: columnsInfo,
      dateTest: {
        original: testDate,
        formatted: formattedDate
      }
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all weapons
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT w.*, m.Name as Manufacturer_Name
      FROM Weapon w
      LEFT JOIN Manufacturer m ON w.Manufacturer_ID = m.Manufacturer_ID
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching weapons:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get weapon by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT w.*, m.Name as Manufacturer_Name
      FROM Weapon w
      LEFT JOIN Manufacturer m ON w.Manufacturer_ID = m.Manufacturer_ID
      WHERE w.Weapon_ID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Weapon not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching weapon by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new weapon
router.post('/', async (req, res) => {
  const {
    Name,
    Type,
    Model,
    Serial_Number,
    Manufacturer_ID,
    Caliber,
    Status,
    Assigned_Unit_ID,
    Last_Inspection_Date,
    Facility_ID,
    Acquisition_Date
  } = req.body;

  // Format dates to MySQL format (YYYY-MM-DD)
  const formattedLastInspectionDate = Last_Inspection_Date ? new Date(Last_Inspection_Date).toISOString().split('T')[0] : null;
  const formattedAcquisitionDate = Acquisition_Date ? new Date(Acquisition_Date).toISOString().split('T')[0] : null;

  try {
    console.log('Creating weapon with data:', req.body);
    const [result] = await pool.query(`
      INSERT INTO Weapon (
        Name, Type, Model, Serial_Number, Manufacturer_ID, Caliber, 
        Status, Assigned_Unit_ID, Last_Inspection_Date, Facility_ID, Acquisition_Date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      Name, Type, Model, Serial_Number, Manufacturer_ID, Caliber,
      Status, Assigned_Unit_ID, formattedLastInspectionDate, Facility_ID, formattedAcquisitionDate
    ]);

    console.log('Weapon created successfully:', result);
    res.status(201).json({
      id: result.insertId,
      message: 'Weapon created successfully'
    });
  } catch (error) {
    console.error('Error creating weapon:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update weapon
router.put('/:id', async (req, res) => {
  const {
    Name,
    Type,
    Model,
    Serial_Number,
    Manufacturer_ID,
    Caliber,
    Status,
    Assigned_Unit_ID,
    Last_Inspection_Date,
    Facility_ID,
    Acquisition_Date
  } = req.body;
  
  try {
    console.log('Updating weapon with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    // Format dates properly for MySQL (YYYY-MM-DD)
    const formattedLastInspectionDate = Last_Inspection_Date ? new Date(Last_Inspection_Date).toISOString().split('T')[0] : null;
    const formattedAcquisitionDate = Acquisition_Date ? new Date(Acquisition_Date).toISOString().split('T')[0] : null;
    
    console.log('Formatted dates:');
    console.log('  Last_Inspection_Date:', Last_Inspection_Date, '->', formattedLastInspectionDate);
    console.log('  Acquisition_Date:', Acquisition_Date, '->', formattedAcquisitionDate);
    console.log('  Facility_ID:', Facility_ID);
    
    // Using explicit field names and ensuring we're using Facility_ID
    const query = `
      UPDATE Weapon SET
        Name = ?,
        Type = ?,
        Model = ?,
        Serial_Number = ?,
        Manufacturer_ID = ?,
        Caliber = ?,
        Status = ?,
        Assigned_Unit_ID = ?,
        Last_Inspection_Date = ?,
        Facility_ID = ?,
        Acquisition_Date = ?
      WHERE Weapon_ID = ?
    `;
    
    const params = [
      Name, Type, Model, Serial_Number, Manufacturer_ID, Caliber,
      Status, Assigned_Unit_ID, formattedLastInspectionDate, Facility_ID, formattedAcquisitionDate,
      req.params.id
    ];
    
    console.log('SQL query:', query);
    console.log('Parameters:', params);
    
    const [result] = await pool.query(query, params);

    console.log('Update result:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Weapon not found' });
    }

    res.json({ message: 'Weapon updated successfully' });
  } catch (error) {
    console.error('Error updating weapon:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete weapon
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Weapon WHERE Weapon_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Weapon not found' });
    }

    res.json({ message: 'Weapon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 