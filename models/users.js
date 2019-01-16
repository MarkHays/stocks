module.exports = function(sequelize, DataTypes) {
      var Users = sequelize.define("Users", {
                    user_id: DataTypes.STRING,
                    budget: DataTypes.INTEGER
        });
      return Users;
  };