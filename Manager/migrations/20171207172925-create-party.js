module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('parties', {
      party_code: {
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('parties')
  }
}
