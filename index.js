const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Jimp = require('jimp'); // Import Jimp for image manipulation
const app = express();

const API_KEY = 'NayemLeakStudioBD';

// Enable CORS for all routes
app.use(cors());

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

// Endpoint to fetch images and overlay text
app.get('/image', async (req, res) => {
    const iconName = req.query.iconName;
    if (!iconName) {
        return res.status(400).send('iconName query parameter is required');
    }

    const imageUrl = `https://freefiremobile-a.akamaihd.net/common/Local/PK/FF_UI_Icon/${iconName}`;

    try {
        // Fetch the image from the URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Load the image using Jimp
        const image = await Jimp.read(imageBuffer);

        // Load a font from Jimp
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // You can change the font size and color

        // Add the text to the image
        image.print(
            font,
            0,
            0,
            {
                text: '@leakstudio',
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            image.bitmap.width,
            image.bitmap.height
        );

        // Get the image buffer with the text overlay
        const modifiedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

        // Send the modified image as response
        res.set('Content-Type', 'image/png');
        res.send(modifiedBuffer);
    } catch (error) {
        res.status(404).send('Image not found');
    }
});

// Export the app for Vercel
module.exports = app;
