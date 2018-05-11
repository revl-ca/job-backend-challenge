module.exports = (sequelize, DataTypes) => {
  return sequelize.define('party', {
    party_code: { type: DataTypes.UUID, primaryKey: true }
  }, {
    classMethods: {
      associate: models => {

      }
    }
  })
}
