require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// basic get route
app.get('/', (req, res) => {
    res.json({
        status: 'active',
        message: 'MB Backend firing 🚀'
    })
});

app.listen(PORT, () => {
    console.log(`\n 🟢 Server running on ${PORT}`);
    console.log(`Accepting requests from ${process.env.CLIENT_URL}`);
});

module.exports = { supabase };