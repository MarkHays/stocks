module.exports = function(sequelize, DataTypes) {
      var Users = sequelize.define("Users", {
                    username: DataTypes.STRING,
                    budget: DataTypes.INTEGER
        });
      Users.associate = function(models){
        Users.belongsTo(models.Positions,{foreignKey:"username"});
      }
      return Users;
  };