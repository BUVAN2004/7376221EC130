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





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
