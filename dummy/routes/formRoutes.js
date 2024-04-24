const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Importing the function to generate a UUID

router.post('/submit-form', (req, res) => {
    console.log('Received submission:', req.body); // Enhanced logging for debugging

    const newSubmission = {
        id: uuidv4(), // Generates a unique UUID for each submission
        ...req.body,
        status: 'Pending' // Initialize status as 'Pending'
    };

    const filePath = path.join(__dirname, '../data/submissions.json');
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading the submissions file:', err);
            return res.status(500).json({ error: 'Error reading the submissions file' });
        }

        let submissions;
        try {
            submissions = JSON.parse(fileData);
        } catch (parseError) {
            console.error('Error parsing JSON from file:', parseError);
            submissions = []; // Assume file might be corrupt or empty and start fresh
        }

        submissions.push(newSubmission);

        fs.writeFile(filePath, JSON.stringify(submissions, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to the submissions file:', writeErr);
                return res.status(500).json({ error: 'Error writing to the submissions file' });
            }
            console.log('Submission saved:', newSubmission);
            res.status(201).json({ message: 'Form data saved successfully' });
        });
    });
});

module.exports = router;
