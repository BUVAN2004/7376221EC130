const express = require("express");
const axios = require("axios");
const https = require("https");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(express.json());

const API_BASE_URL = "https://20.244.56.144/test";

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

const getAccessToken = async () => {
    try {
        const response = await axios.post("http://20.244.56.144/test/auth", {
            companyName: process.env.COMPANY_NAME,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            ownerName: process.env.OWNER_NAME,
            ownerEmail: process.env.OWNER_EMAIL,
            rollNo: process.env.ROLL_NO,
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error.response?.data || error.message);
    }
};

const fetchData = async (endpoint, res, errorMessage) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axiosInstance.get(`${API_BASE_URL}/${endpoint}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        res.status(500).json({ error: errorMessage });
    }
};

app.get("/numbers/p", (req, res) => fetchData("primes", res, "Error fetching prime numbers"));
app.get("/numbers/f", (req, res) => fetchData("fibo", res, "Error fetching Fibonacci numbers"));
app.get("/numbers/r", (req, res) => fetchData("rand", res, "Error fetching random numbers"));




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
