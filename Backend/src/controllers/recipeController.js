
const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const recipes = await Recipe.find()
      .sort({ rating: -1 }) 
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments();

    res.json({
      page,
      limit,
      total,
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

exports.searchRecipes = async (req, res) => {
  const { title, cuisine, calories, total_time, rating } = req.query;
  const filter = {};

  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }
  if (cuisine) {
    filter.cuisine = { $regex: cuisine, $options: 'i' };
  }
  if (total_time) {
    filter.total_time = { $lte: parseInt(total_time, 10) };
  }
  if (rating) {
    filter.rating = { $gte: parseFloat(rating) };
  }
  if (calories) {
    const calValue = parseInt(calories.match(/\d+/)[0], 10);
    filter['nutrients.calories'] = { $lte: calValue };
  }

  try {
    const recipes = await Recipe.find(filter);
    res.json({ data: recipes });
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes', error });
  }
};