const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");

router.get('/:query', async(request, response) => {
    try {
        const params = new URLSearchParams({
            access_token: process.env.API_KEY,
            ...url.parse(request.url, true).query,
        });
        console.log(params);
        const query = request.params.query;
        const results = await axios(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`);
        const data = results.data;
        response.status(500).json(data);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;