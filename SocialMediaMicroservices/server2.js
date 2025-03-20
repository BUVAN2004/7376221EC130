const express = require("express");
const axios = require("axios");
const https = require("https");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(express.json());

const API_BASE_URL = "https://20.244.56.144/test";
const WINDOW_SIZE = 10;
const validIds = new Set(["p", "f", "e", "r"]);
const windows = { p: [], f: [], e: [], r: [] };

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  timeout: 500,
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
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
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

const fetchNumbers = async (numberId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axiosInstance.get(`${API_BASE_URL}/${numberId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching numbers (${numberId}):`, error.message);
    return [];
  }
};

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  if (!validIds.has(numberid))
    return res.status(400).json({ error: "Invalid number ID" });

  const prevState = [...windows[numberid]];
  const newNumbers = await fetchNumbers(numberid);

  let uniqueNumbers = [...new Set([...windows[numberid], ...newNumbers])];

  if (uniqueNumbers.length > WINDOW_SIZE) {
    uniqueNumbers = uniqueNumbers.slice(uniqueNumbers.length - WINDOW_SIZE);
  }

  windows[numberid] = uniqueNumbers;
  const avg = uniqueNumbers.length
    ? (uniqueNumbers.reduce((a, b) => a + b, 0) / uniqueNumbers.length).toFixed(
        2
      )
    : 0;

  res.status(200).json({
    windowPrevState: prevState,
    windowCurrState: windows[numberid],
    numbers: newNumbers,
    avg: avg,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
