module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('participants', {
      device_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      party_code: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      is_leader: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('participants')
  }
}
