const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const connectDB = require("../config/db");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const cleanNumeric = (value) => {
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

const seedDatabase = async () => {
  await connectDB();

  try {
    await Recipe.deleteMany({});
    console.log("Previous recipes cleared!");

    const filePath = path.join(__dirname, "../../data/US_recipes_null.json");
    const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let recipesData;
    if (Array.isArray(rawData)) {
      recipesData = rawData;
    } else if (rawData && typeof rawData === "object") {
      recipesData = Object.values(rawData);
    } else {
      throw new Error(
        "Unexpected recipes data format: expected an array or an object of recipes"
      );
    }

    const cleanedRecipes = recipesData.map((recipe) => ({
      ...recipe,
      rating: !isNaN(parseFloat(recipe.rating))
        ? parseFloat(recipe.rating)
        : null,
      prep_time: cleanNumeric(recipe.prep_time),
      cook_time: cleanNumeric(recipe.cook_time),
      total_time: cleanNumeric(recipe.total_time),
    }));

    // Filter out recipes missing the required `title` field to avoid validation errors
    const validRecipes = cleanedRecipes.filter(
      (r) => r.title && String(r.title).trim() !== ""
    );
    const skipped = cleanedRecipes.length - validRecipes.length;
    console.log(
      `Recipes found: ${recipesData.length}, cleaned: ${cleanedRecipes.length}, inserting: ${validRecipes.length}, skipped: ${skipped}`
    );

    if (validRecipes.length === 0) {
      console.log("No valid recipes to insert. Exiting.");
    } else {
      await Recipe.insertMany(validRecipes);
      console.log("Database has been seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
