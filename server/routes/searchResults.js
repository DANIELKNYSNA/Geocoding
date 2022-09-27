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

        //format data to include city and state
        results.data.features.forEach((item) => {
            item.city = null;
            item.state = null;
            //cycle through content results
            item.context.forEach((type) => {
                if (type.id.includes("place")) {
                    item.city = type.text;
                }
                if (type.id.includes("region")) {
                    item.state = type.text;
                }
            });
        });
        const data = results.data;
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;