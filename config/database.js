const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
console.log('proces.env', process.env)
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
    console.log('env', config.use_env_variable, process.env[config.use_env_variable])
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Export the connection to be used in the models
module.exports = sequelize;