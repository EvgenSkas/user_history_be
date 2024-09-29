module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Code for other migrations (if any)
  },
  down: async (queryInterface, Sequelize) => {
    // Drop the "users" table
    // await queryInterface.dropTable('Users');
  }
};