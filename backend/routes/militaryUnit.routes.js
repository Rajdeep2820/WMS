const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Get all military units
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT mu.*, 
        COUNT(DISTINCT s.Soldier_ID) as Soldier_Count,
        COUNT(DISTINCT wa.Assignment_ID) as Weapon_Assignment_Count
      FROM Military_Unit mu
      LEFT JOIN Soldier s ON mu.Unit_ID = s.Unit_ID
      LEFT JOIN Weapon_Assignment wa ON s.Soldier_ID = wa.Soldier_ID
      GROUP BY mu.Unit_ID
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get military unit by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Military_Unit WHERE Unit_ID = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Military unit not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new military unit
router.post('/', async (req, res) => {
  const { Name, Branch, Location, Commanding_Officer } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO Military_Unit 
       (Name, Branch, Location, Commanding_Officer) 
       VALUES (?, ?, ?, ?)`,
      [Name, Branch, Location, Commanding_Officer]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Military unit created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update military unit
router.put('/:id', async (req, res) => {
  const { Name, Branch, Location, Commanding_Officer } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Military_Unit 
       SET Name = ?, Branch = ?, Location = ?, Commanding_Officer = ?
       WHERE Unit_ID = ?`,
      [Name, Branch, Location, Commanding_Officer, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Military unit not found' });
    }

    res.json({ message: 'Military unit updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete military unit
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Military_Unit WHERE Unit_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Military unit not found' });
    }

    res.json({ message: 'Military unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 