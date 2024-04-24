const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Path to the user data file
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Function to read users from the file
const getUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
};

// Function to save users to the file
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        const users = getUsers();
        if (users.find(user => user.username === username)) {
            return res.status(409).send('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = { id: users.length + 1, username, password: hashedPassword, role: 'admin' };
        users.push(newUser);
        saveUsers(users);
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Server error during registration');
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        const users = getUsers();
        const user = users.find(user => user.username === username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Authentication failed');
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '8h' });
        res.json({ token, userId: user.id, role: user.role });
    } catch (error) {
        res.status(500).send('Server error during login');
    }
});

module.exports = router;
