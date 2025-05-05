const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Get all storage facilities
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all storage facilities');
    
    const [rows] = await pool.query('SELECT * FROM Storage_Facility');
    
    console.log(`Retrieved ${rows.length} storage facilities`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching storage facilities:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get storage facility by ID
router.get('/:id', async (req, res) => {
  try {
    const facilityId = req.params.id;
    console.log(`Fetching storage facility with ID: ${facilityId}`);
    
    const [rows] = await pool.query(
      'SELECT * FROM Storage_Facility WHERE Facility_ID = ?', 
      [facilityId]
    );
    
    if (rows.length === 0) {
      console.log(`Storage facility with ID ${facilityId} not found`);
      return res.status(404).json({ message: 'Storage facility not found' });
    }
    
    console.log('Retrieved storage facility:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching storage facility with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create new storage facility
router.post('/', async (req, res) => {
  try {
    console.log('Creating new storage facility with data:', req.body);
    
    const { 
      Name, 
      Location, 
      Capacity, 
      Security_Level, 
      Status
    } = req.body;

    // Validate required fields
    if (!Name) {
      return res.status(400).json({ 
        message: 'Name is required' 
      });
    }

    // Validate capacity if provided
    if (Capacity !== undefined) {
      const capacityValue = parseInt(Capacity, 10);
      if (isNaN(capacityValue) || capacityValue < 0) {
        return res.status(400).json({ 
          message: 'Capacity must be a non-negative number' 
        });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO Storage_Facility 
       (Name, Location, Capacity, Security_Level, Status) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        Name, 
        Location || null, 
        Capacity !== undefined ? parseInt(Capacity, 10) : null, 
        Security_Level || 'Medium', 
        Status || 'Operational'
      ]
    );

    console.log('Storage facility created successfully with ID:', result.insertId);
    
    res.status(201).json({
      id: result.insertId,
      message: 'Storage facility created successfully'
    });
  } catch (error) {
    console.error('Error creating storage facility:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update storage facility
router.put('/:id', async (req, res) => {
  try {
    const facilityId = req.params.id;
    console.log(`Updating storage facility with ID ${facilityId}:`, req.body);
    
    const { 
      Name, 
      Location, 
      Capacity, 
      Security_Level, 
      Status
    } = req.body;

    // Validate required fields
    if (!Name) {
      console.log('Validation failed: Missing name');
      return res.status(400).json({ 
        message: 'Name is required' 
      });
    }

    // Validate capacity if provided
    if (Capacity !== undefined) {
      const capacityValue = parseInt(Capacity, 10);
      if (isNaN(capacityValue) || capacityValue < 0) {
        console.log('Validation failed: Invalid capacity value', Capacity);
        return res.status(400).json({ 
          message: 'Capacity must be a non-negative number' 
        });
      }
    }

    // Check if facility exists
    const [facilities] = await pool.query(
      'SELECT Facility_ID FROM Storage_Facility WHERE Facility_ID = ?', 
      [facilityId]
    );
    
    if (facilities.length === 0) {
      console.log(`Storage facility with ID ${facilityId} not found`);
      return res.status(404).json({ 
        message: `Storage facility with ID ${facilityId} not found` 
      });
    }

    console.log('Executing update query with values:', {
      Name,
      Location,
      Capacity: Capacity !== undefined ? parseInt(Capacity, 10) : null,
      Security_Level,
      Status,
      Facility_ID: facilityId
    });

    const [result] = await pool.query(
      `UPDATE Storage_Facility 
       SET Name = ?, Location = ?, Capacity = ?, Security_Level = ?, Status = ?
       WHERE Facility_ID = ?`,
      [
        Name, 
        Location || null, 
        Capacity !== undefined ? parseInt(Capacity, 10) : null, 
        Security_Level || 'Medium', 
        Status || 'Operational', 
        facilityId
      ]
    );

    if (result.affectedRows === 0) {
      console.log(`No rows affected when updating facility ID ${facilityId}`);
      return res.status(404).json({ message: 'Storage facility not found' });
    }

    console.log(`Storage facility with ID ${facilityId} updated successfully. Result:`, result);
    res.json({ message: 'Storage facility updated successfully' });
  } catch (error) {
    console.error(`Error updating storage facility with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Delete storage facility
router.delete('/:id', async (req, res) => {
  try {
    const facilityId = req.params.id;
    console.log(`Deleting storage facility with ID: ${facilityId}`);
    
    // Check for dependencies before deletion
    const [weapons] = await pool.query(
      'SELECT COUNT(*) as count FROM Weapon WHERE Facility_ID = ?',
      [facilityId]
    );
    
    const [ammunition] = await pool.query(
      'SELECT COUNT(*) as count FROM Ammunition WHERE Facility_ID = ?',
      [facilityId]
    );
    
    if (weapons[0].count > 0 || ammunition[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete facility with assigned weapons or ammunition',
        weapons: weapons[0].count,
        ammunition: ammunition[0].count
      });
    }

    const [result] = await pool.query(
      'DELETE FROM Storage_Facility WHERE Facility_ID = ?',
      [facilityId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Storage facility not found' });
    }

    console.log(`Storage facility with ID ${facilityId} deleted successfully`);
    res.json({ message: 'Storage facility deleted successfully' });
  } catch (error) {
    console.error(`Error deleting storage facility with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 