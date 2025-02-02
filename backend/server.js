require("dotenv").config();
const express = require("express");
const cors = require("cors");
const IntaSend = require("intasend-node");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize IntaSend
const intasend = new IntaSend(
    process.env.INTASEND_PUBLISHABLE_KEY,
    process.env.INTASEND_SECRET_KEY,
    true // Set to `false` for live mode
);

app.post("/pay", async (req, res) => {
    const { phone } = req.body;

    if (!phone || !phone.match(/^07\d{8}$/)) {
        return res.status(400).json({ error: "Invalid phone number format. Use 07XXXXXXXX." });
    }

    try {
        const response = await intasend.collection().mpesaStkPush({
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            host: "https://yourwebsite.com", // Replace with your website URL
            amount: 10,
            phone_number: "+254" + phone.substring(1),
            api_ref: "test_transaction"
        });

        console.log("✅ STK Push Response:", response);
        res.json(response);
    } catch (error) {
        console.error("❌ STK Push Error:", error);
        res.status(500).json({ error: "Payment failed", details: error.message });
    }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
