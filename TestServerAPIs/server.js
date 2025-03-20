const express = require("express");
const axios = require('axios');
require("dotenv").config({path : "./.env"});

const app = express();

app.use(express.json());

app.get('/numbers/p', async (req, res) => {
    const accessToken = process.env.ACCESS_TOKEN;
    const url = 'https://20.244.56.144/test/primes';
    try {
        const response = await axios.get(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error making Get request:', error);
        res.status(500).json({ error: 'An error occurred while making the GET request for primes' });
    }
});

app.get('/numbers/f', async (req, res) => {
    const accessToken = process.env.ACCESS_TOKEN;
    const url = 'https://20.244.56.144/test/fibo';
    try {
        const response = await axios.get(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error making Get request:', error);
        res.status(500).json({ error: 'An error occurred while making the GET request for fibonacci' });
    }
});

app.get('/numbers/r', async (req, res) => {
    const accessToken = process.env.ACCESS_TOKEN;
    const url = 'https://20.244.56.144/test/rand';
    try {
        const response = await axios.get(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error making Get request:', error);
        res.status(500).json({ error: 'An error occurred while making the GET request for Random numbers' });
    }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})