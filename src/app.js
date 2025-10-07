const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => res.send('Recipe API is running!'));
app.use('/api/recipes', recipeRoutes);

module.exports = app;
