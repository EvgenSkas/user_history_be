const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.db) {
    sequelize = new Sequelize(process.env[config.db]);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Export the connection to be used in the models
module.exports = sequelize;