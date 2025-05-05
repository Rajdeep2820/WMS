const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Debug route to check table structure
router.get('/debug/schema', async (req, res) => {
  try {
    const [columnsInfo] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'weaponry_management' 
      AND TABLE_NAME = 'Ammunition'
    `);
    
    console.log('Ammunition table schema:', columnsInfo);
    
    // Also check Storage_Facility schema
    const [facilityColumns] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'weaponry_management' 
      AND TABLE_NAME = 'Storage_Facility'
    `);
    
    console.log('Storage_Facility table schema:', facilityColumns);
    
    res.json({
      ammunition: columnsInfo,
      storageFacility: facilityColumns
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all ammunition with correct field names
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT a.*, 
        m.Name as Manufacturer_Name,
        sf.Name as Facility_Name
      FROM Ammunition a
      LEFT JOIN Manufacturer m ON a.Manufacturer_ID = m.Manufacturer_ID
      LEFT JOIN Storage_Facility sf ON a.Facility_ID = sf.Facility_ID
    `;
    console.log('Executing ammunition query:', query);
    
    const [rows] = await pool.query(query);
    
    // Add Name field if it doesn't exist (using Type as fallback)
    const formattedRows = rows.map(row => ({
      ...row,
      Name: row.Name || row.Type
    }));
    
    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching ammunition:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get ammunition by ID with correct field names
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, 
        m.Name as Manufacturer_Name,
        sf.Name as Facility_Name 
      FROM Ammunition a
      LEFT JOIN Manufacturer m ON a.Manufacturer_ID = m.Manufacturer_ID
      LEFT JOIN Storage_Facility sf ON a.Facility_ID = sf.Facility_ID
      WHERE a.Ammunition_ID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ammunition not found' });
    }
    
    // Add Name field if it doesn't exist (using Type as fallback)
    const formattedRow = {
      ...rows[0],
      Name: rows[0].Name || rows[0].Type
    };
    
    res.json(formattedRow);
  } catch (error) {
    console.error('Error fetching ammunition by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new ammunition with correct field names
router.post('/', async (req, res) => {
  const {
    Name,
    Type,
    Caliber,
    Quantity,
    Manufacturer_ID,
    Production_Date,
    Expiration_Date,
    Facility_ID,
    Status,
    Batch_Number
  } = req.body;

  try {
    // Check if Manufacturer_ID exists before inserting
    if (Manufacturer_ID) {
      const [manufacturers] = await pool.query(
        'SELECT Manufacturer_ID FROM Manufacturer WHERE Manufacturer_ID = ?', 
        [Manufacturer_ID]
      );
      
      if (manufacturers.length === 0) {
        return res.status(400).json({ 
          message: `Manufacturer with ID ${Manufacturer_ID} does not exist` 
        });
      }
    }
    
    // Format dates to MySQL format (YYYY-MM-DD)
    const formattedProductionDate = Production_Date ? new Date(Production_Date).toISOString().split('T')[0] : null;
    const formattedExpirationDate = Expiration_Date ? new Date(Expiration_Date).toISOString().split('T')[0] : null;
    
    const [result] = await pool.query(`
      INSERT INTO Ammunition (
        Name, Type, Caliber, Quantity, Manufacturer_ID,
        Production_Date, Expiration_Date, Facility_ID,
        Status, Batch_Number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      Name, Type, Caliber, Quantity, Manufacturer_ID || null,
      formattedProductionDate, formattedExpirationDate, Facility_ID || null,
      Status, Batch_Number
    ]);

    res.status(201).json({
      id: result.insertId,
      message: 'Ammunition created successfully'
    });
  } catch (error) {
    console.error('Error creating ammunition:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update ammunition with correct field names
router.put('/:id', async (req, res) => {
  const {
    Name,
    Type,
    Caliber,
    Quantity,
    Manufacturer_ID,
    Production_Date,
    Expiration_Date,
    Facility_ID,
    Status,
    Batch_Number
  } = req.body;

  try {
    // Check if Manufacturer_ID exists before updating
    if (Manufacturer_ID) {
      const [manufacturers] = await pool.query(
        'SELECT Manufacturer_ID FROM Manufacturer WHERE Manufacturer_ID = ?', 
        [Manufacturer_ID]
      );
      
      if (manufacturers.length === 0) {
        return res.status(400).json({ 
          message: `Manufacturer with ID ${Manufacturer_ID} does not exist` 
        });
      }
    }
    
    // Format dates to MySQL format (YYYY-MM-DD)
    const formattedProductionDate = Production_Date ? new Date(Production_Date).toISOString().split('T')[0] : null;
    const formattedExpirationDate = Expiration_Date ? new Date(Expiration_Date).toISOString().split('T')[0] : null;

    const [result] = await pool.query(`
      UPDATE Ammunition SET
        Name = ?, Type = ?, Caliber = ?, Quantity = ?, Manufacturer_ID = ?,
        Production_Date = ?, Expiration_Date = ?, Facility_ID = ?,
        Status = ?, Batch_Number = ?
      WHERE Ammunition_ID = ?
    `, [
      Name, Type, Caliber, Quantity, Manufacturer_ID || null,
      formattedProductionDate, formattedExpirationDate, Facility_ID || null,
      Status, Batch_Number, req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ammunition not found' });
    }

    res.json({ message: 'Ammunition updated successfully' });
  } catch (error) {
    console.error('Error updating ammunition:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete ammunition
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Ammunition WHERE Ammunition_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ammunition not found' });
    }

    res.json({ message: 'Ammunition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 