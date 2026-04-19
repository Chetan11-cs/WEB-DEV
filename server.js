const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.log("❌ DB Error:", err));

// Route to get all products with a category filter
app.get('/api/products', async (req, res) => {
    const { category } = req.query;
    const query = category ? { category } : {};
    const products = await require('./models/Product').find(query);
    res.json(products);
});

app.listen(5000, () => console.log("🚀 Server running on Port 5000"));