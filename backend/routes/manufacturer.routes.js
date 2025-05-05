const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Get all manufacturers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, 
        (SELECT COUNT(*) FROM Weapon w WHERE w.Manufacturer_ID = m.Manufacturer_ID) as Weapon_Count,
        (SELECT COUNT(*) FROM Ammunition a WHERE a.Manufacturer_ID = m.Manufacturer_ID) as Ammunition_Count
      FROM Manufacturer m
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get manufacturer by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Manufacturer WHERE Manufacturer_ID = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new manufacturer
router.post('/', async (req, res) => {
  const { Name, Country, Contact_Info, Status } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO Manufacturer (Name, Country, Contact_Info, Status) VALUES (?, ?, ?, ?)',
      [Name, Country, Contact_Info, Status || 'Active']
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Manufacturer created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update manufacturer
router.put('/:id', async (req, res) => {
  const { Name, Country, Contact_Info, Status } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Manufacturer 
       SET Name = ?, Country = ?, Contact_Info = ?, Status = ?
       WHERE Manufacturer_ID = ?`,
      [Name, Country, Contact_Info, Status || 'Active', req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }

    res.json({ message: 'Manufacturer updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete manufacturer
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Manufacturer WHERE Manufacturer_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }

    res.json({ message: 'Manufacturer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 