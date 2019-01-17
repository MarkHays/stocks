module.exports = function(sequelize, DataTypes) {
    var Positions = sequelize.define("Positions", {
      user_id: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      symbol: DataTypes.STRING
    }, {
      timestamps : false
    });
    Positions.associate = function(models){
      Positions.belongsTo(models.Users,{foreignKey:"user_id"});
    }
    return Positions;
  };