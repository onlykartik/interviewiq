const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/companies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM companies ORDER BY name'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    res.status(500).json({ success: false });
  }
});

// POST /api/companies
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        console.log(req.body)

        // 1. Basic validation
        if (!name || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Company name is required'
        });
        }

        // 2. Insert into DB
        const result = await pool.query(
        'INSERT INTO companies (name) VALUES ($1) RETURNING id, name',
        [name.trim()]
        );

        // 3. Return created company
        res.status(201).json({
        success: true,
        data: result.rows[0]
        });

    } catch (error) {
        // 4. Handle duplicate company
        if (error.code === '23505') {
        return res.status(409).json({
            success: false,
            message: 'Company already exists'
        });
        }

        console.error('Error creating company:', error.message);
        res.status(500).json({ success: false });
    }
});



module.exports = router;
