
const User = require('./user');
const Payment = require('./payment');
const Product = require('./product');
const sequelize = require('../config/database');

// Initialize all the models and relationships
const initModels = async () => {
  await sequelize.sync({ force: false });
  console.log('Tables have been created');
};

// Export the models and init function
module.exports = {
  sequelize,
  User,
  Payment,
  Product,
  initModels,
};