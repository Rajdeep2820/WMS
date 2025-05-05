const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Get all weapon assignments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT wa.*, 
        w.Serial_Number as Weapon_Serial,
        s.First_Name, s.Last_Name,
        mu.Name as Unit_Name
      FROM Weapon_Assignment wa
      LEFT JOIN Weapon w ON wa.Weapon_ID = w.Weapon_ID
      LEFT JOIN Soldier s ON wa.Soldier_ID = s.Soldier_ID
      LEFT JOIN Military_Unit mu ON wa.Unit_ID = mu.Unit_ID
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get weapon assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT wa.*, 
        w.Serial_Number as Weapon_Serial,
        s.First_Name, s.Last_Name,
        mu.Name as Unit_Name
      FROM Weapon_Assignment wa
      LEFT JOIN Weapon w ON wa.Weapon_ID = w.Weapon_ID
      LEFT JOIN Soldier s ON wa.Soldier_ID = s.Soldier_ID
      LEFT JOIN Military_Unit mu ON wa.Unit_ID = mu.Unit_ID
      WHERE wa.Assignment_ID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Weapon assignment not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new weapon assignment
router.post('/', async (req, res) => {
  const {
    Weapon_ID,
    Soldier_ID,
    Unit_ID,
    Assignment_Date,
    Return_Date,
    Status,
    Notes
  } = req.body;

  try {
    const [result] = await pool.query(`
      INSERT INTO Weapon_Assignment (
        Weapon_ID, Soldier_ID, Unit_ID, Assignment_Date,
        Return_Date, Status, Notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      Weapon_ID, Soldier_ID, Unit_ID, Assignment_Date,
      Return_Date, Status, Notes
    ]);

    res.status(201).json({
      id: result.insertId,
      message: 'Weapon assignment created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update weapon assignment
router.put('/:id', async (req, res) => {
  const {
    Weapon_ID,
    Soldier_ID,
    Unit_ID,
    Assignment_Date,
    Return_Date,
    Status,
    Notes
  } = req.body;

  try {
    const [result] = await pool.query(`
      UPDATE Weapon_Assignment SET
        Weapon_ID = ?, Soldier_ID = ?, Unit_ID = ?,
        Assignment_Date = ?, Return_Date = ?, Status = ?, Notes = ?
      WHERE Assignment_ID = ?
    `, [
      Weapon_ID, Soldier_ID, Unit_ID, Assignment_Date,
      Return_Date, Status, Notes, req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Weapon assignment not found' });
    }

    res.json({ message: 'Weapon assignment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete weapon assignment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Weapon_Assignment WHERE Assignment_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Weapon assignment not found' });
    }

    res.json({ message: 'Weapon assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 