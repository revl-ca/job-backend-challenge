'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('participant', {
    device_id: { type: DataTypes.STRING, primaryKey: true },
    party_code: { type: DataTypes.UUID, primaryKey: true },
    is_leader: { type: DataTypes.BOOLEAN }
  }, {
    classMethods: {
      associate: models => {

      }
    }
  })
}
