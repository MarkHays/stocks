module.exports = function(sequelize, DataTypes) {
    var Positions = sequelize.define("Positions", {
      user_id: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      symbol: DataTypes.STRING
    }, {
      timestamps : false
    });
    return Positions;
  };