const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

// Get all soldiers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, mu.Name as Unit_Name
      FROM Soldier s
      LEFT JOIN Military_Unit mu ON s.Unit_ID = mu.Unit_ID
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching soldiers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get soldier by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, mu.Name as Unit_Name
      FROM Soldier s
      LEFT JOIN Military_Unit mu ON s.Unit_ID = mu.Unit_ID
      WHERE s.Soldier_ID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Soldier not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching soldier with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create new soldier
router.post('/', async (req, res) => {
  const {
    First_Name,
    Last_Name,
    Rank,
    Serial_Number,
    Date_of_Birth,
    Join_Date,
    Unit_ID,
    Status,
    Specialization
  } = req.body;

  try {
    console.log('Creating new soldier with data:', req.body);
    
    const [result] = await pool.query(`
      INSERT INTO Soldier (
        First_Name, Last_Name, \`Rank\`, Serial_Number, Date_of_Birth,
        Join_Date, Unit_ID, Status, Specialization
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      First_Name, Last_Name, Rank, Serial_Number, Date_of_Birth,
      Join_Date, Unit_ID, Status, Specialization
    ]);

    console.log('Soldier created successfully with ID:', result.insertId);
    
    res.status(201).json({
      id: result.insertId,
      message: 'Soldier created successfully'
    });
  } catch (error) {
    console.error('Error creating soldier:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update soldier
router.put('/:id', async (req, res) => {
  const {
    First_Name,
    Last_Name,
    Rank,
    Serial_Number,
    Date_of_Birth,
    Join_Date,
    Unit_ID,
    Status,
    Specialization
  } = req.body;

  try {
    console.log(`Updating soldier with ID ${req.params.id}:`, req.body);
    
    const [result] = await pool.query(`
      UPDATE Soldier SET
        First_Name = ?, Last_Name = ?, \`Rank\` = ?, Serial_Number = ?,
        Date_of_Birth = ?, Join_Date = ?, Unit_ID = ?, Status = ?,
        Specialization = ?
      WHERE Soldier_ID = ?
    `, [
      First_Name, Last_Name, Rank, Serial_Number, Date_of_Birth,
      Join_Date, Unit_ID, Status, Specialization, req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Soldier not found' });
    }

    console.log(`Soldier with ID ${req.params.id} updated successfully`);
    res.json({ message: 'Soldier updated successfully' });
  } catch (error) {
    console.error(`Error updating soldier with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Delete soldier
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM Soldier WHERE Soldier_ID = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Soldier not found' });
    }

    res.json({ message: 'Soldier deleted successfully' });
  } catch (error) {
    console.error(`Error deleting soldier with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 