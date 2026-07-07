require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

async function getToken() {
    const params = new URLSearchParams();
    params.append(
        "grant_type",
        "urn:ibm:params:oauth:grant-type:apikey"
    );
    params.append("apikey", process.env.IBM_API_KEY);

    const response = await axios.post(
        "https://iam.cloud.ibm.com/identity/token",
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data.access_token;
}

app.post("/predict", async (req, res) => {
    try {
        const token = await getToken();

        const { male, female, sc, st } = req.body;

        const payload = {
            input_data: [
                {
                    fields: [
                        "finyear",
                        "lgdstatecode",
                        "statename",
                        "lgddistrictcode",
                        "districtname",
                        "totalbeneficiaries",
                        "totalmale",
                        "totalfemale",
                        "totaltransgender",
                        "totalsc",
                        "totalst",
                        "totalgen",
                        "totalobc",
                        "totalaadhaar",
                        "totalmpbilenumber"
                    ],
                    values: [[
                        2024,
                        9,
                        "DemoState",
                        1,
                        "DemoDistrict",
                        Number(male) + Number(female),
                        Number(male),
                        Number(female),
                        0,
                        Number(sc),
                        Number(st),
                        0,
                        0,
                        100,
                        100
                    ]]
                }
            ]
        };

        const result = await axios.post(
            process.env.DEPLOYMENT_URL,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(result.data);

    } catch (err) {
        console.log(err.response?.data || err.message);
        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});