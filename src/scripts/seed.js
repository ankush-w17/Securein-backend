
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const connectDB = require('../config/db');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const cleanNumeric = (value) => {
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

const seedDatabase = async () => {
  await connectDB();

  try {
    await Recipe.deleteMany({});
    console.log('Previous recipes cleared!');

    const filePath = path.join(__dirname, '../../data/recipes.json');
    const recipesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const cleanedRecipes = recipesData.map(recipe => ({
      ...recipe,
      rating: !isNaN(parseFloat(recipe.rating)) ? parseFloat(recipe.rating) : null,
      prep_time: cleanNumeric(recipe.prep_time),
      cook_time: cleanNumeric(recipe.cook_time),
      total_time: cleanNumeric(recipe.total_time),
    }));

    await Recipe.insertMany(cleanedRecipes);
    console.log('Database has been seeded successfully! ');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();