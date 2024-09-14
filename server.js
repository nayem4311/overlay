const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 3000;

const API_KEY = 'NayemLeakStudioBD';

// Enable CORS for all routes
app.use(cors()); // Add this line to enable CORS for all routes

// Middleware to check API key
app.use((req, res, next) => {
    const key = req.query.key;
    if (key !== API_KEY) {
        return res.status(403).send(`
            <h1>403 Forbidden</h1>
            <p>Invalid API key. Please contact our support team at <a href="https://facebook.com/leakstudio">Leak Studio Bangladesh</a> for assistance.</p>
            <p>Ensure that you have the correct credentials to access this resource.</p>
        `);
    }
    next();
});

// Endpoint to fetch images
app.get('/image', async (req, res) => {
    const iconName = req.query.iconName;
    if (!iconName) {
        return res.status(400).send('iconName query parameter is required');
    }

    const imageUrl = `https://freefiremobile-a.akamaihd.net/common/Local/PK/FF_UI_Icon/${iconName}`;

    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        res.status(404).send('Image not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://ffcdn.ohxia.xyz:${port}`);
});
