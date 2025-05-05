const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Get all weapon maintenance records
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT wm.*, 
        w.Serial_Number as Weapon_Serial,
        w.Name as Weapon_Name
      FROM Weapon_Maintenance wm
      LEFT JOIN Weapon w ON wm.Weapon_ID = w.Weapon_ID
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get weapon maintenance by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT wm.*, 
        w.Serial_Number as Weapon_Serial,
        w.Name as Weapon_Name
      FROM Weapon_Maintenance wm
      LEFT JOIN Weapon w ON wm.Weapon_ID = w.Weapon_ID
      WHERE wm.Maintenance_ID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new weapon maintenance record
router.post('/', async (req, res) => {
  const {
    Weapon_ID,
    Type,
    Start_Date,
    End_Date,
    Technician,
    Status,
    Cost,
    Notes
  } = req.body;

  try {
    const [result] = await pool.query(`
      INSERT INTO Weapon_Maintenance (
        Weapon_ID, Type, Start_Date,
        End_Date, Technician, Status,
        Cost, Notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      Weapon_ID, Type, Start_Date,
      End_Date, Technician, Status,
      Cost, Notes
    ]);

    res.status(201).json({
      id: result.insertId,
      message: 'Maintenance record created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update weapon maintenance record
router.put('/:id', async (req, res) => {
  const {
    Weapon_ID,
    Type,
    Start_Date,
    End_Date,
    Technician,
    Status,
    Cost,
    Notes
  } = req.body;

  try {
    const [result] = await pool.query(`
      UPDATE Weapon_Maintenance SET
        Weapon_ID = ?, Type = ?, Start_Date = ?,
        End_Date = ?, Technician = ?, Status = ?,
        Cost = ?, Notes = ?
      WHERE Maintenance_ID = ?
    `, [
      Weapon_ID, Type, Start_Date,
      End_Date, Technician, Status,
      Cost, Notes, req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.json({ message: 'Maintenance record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete weapon maintenance record
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Weapon_Maintenance WHERE Maintenance_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 