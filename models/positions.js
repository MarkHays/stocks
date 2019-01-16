module.exports = function(sequelize, DataTypes) {
    var Positions = sequelize.define("Positions", {
      user_id: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      symbol: DataTypes.STRING
    }, {
      timestamps : false
    });
   /* Positions.associate = function(models){
        Positions.hasMany(models.Users,{foreignKey:"username",constraint:true});
      }*/
    return Positions;
  };