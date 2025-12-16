const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SIGNUP
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✅ Validation
        if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email and password are required'
        });
        }

        // ✅ Check if user already exists
        const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
        );

        if (existingUser.rows.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'User already exists. Please login.'
        });
        }

        // ✅ Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // ✅ Insert user WITH name
        const result = await pool.query(
        `
        INSERT INTO users (name, email, password_hash, auth_provider)
        VALUES ($1, $2, $3, 'local')
        RETURNING id, name, email
        `,
        [name.trim(), email.toLowerCase(), passwordHash]
        );

        const user = result.rows[0];

        // ✅ Generate JWT (keep consistent)
        const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.status(201).json({
        success: true,
        token,
        user
        });

    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ success: false });
    }
});
    // LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Enterd:', email, password )
    const userRes = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (userRes.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    console.log('Out:', email, password , user.password_hash)

    const valid = await bcrypt.compare(password, user.password_hash);
    console.log('Valid', valid)

    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token });
});



// POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
        return res.status(400).json({ success: false });
        }

        const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: google_id } = payload;
        const picture = payload.picture;

        // Check if user exists
        let userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
        );

        let userId;

        if (userResult.rows.length === 0) {
        const insertUser = await pool.query(
            `INSERT INTO users (name, email, auth_provider)
            VALUES ($1, $2, 'Google')
            RETURNING id`,
            [name, email]
        );
        userId = insertUser.rows[0].id;
        } else {
        userId = userResult.rows[0].id;
        }

        const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.json({ token });

    } catch (err) {
        console.error('Google auth error:', err.message);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
