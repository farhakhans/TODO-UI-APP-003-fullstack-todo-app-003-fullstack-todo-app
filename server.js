const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();

// Serve static files
app.use(express.static('.'));

// Route for the test page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'simple-test.html'));
});

// Endpoint to check backend status
app.get('/api/backend-status', async (req, res) => {
    try {
        const { spawn } = require('child_process');
        // This is just to check if the backend is running on port 8080
        const http = require('http');

        return new Promise((resolve, reject) => {
            const request = http.get('http://localhost:8080', (response) => {
                if (response.statusCode === 200) {
                    res.json({ status: 'running', statusCode: response.statusCode });
                } else {
                    res.json({ status: 'not-responding', statusCode: response.statusCode });
                }
                resolve();
            });

            request.on('error', (err) => {
                res.json({ status: 'not-running', error: err.message });
                resolve();
            });

            request.setTimeout(5000, () => {
                request.destroy();
                res.json({ status: 'timeout' });
                resolve();
            });
        });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running at http://localhost:${PORT}`);
    console.log('Open your browser to this address to see the status page');
});