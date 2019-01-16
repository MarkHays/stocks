module.exports = function(sequelize, DataTypes) {
      var Users = sequelize.define("Users", {
                    user_id: DataTypes.STRING,
                    budget: DataTypes.INTEGER
        },{
          timestamps : false
        });
     /* Users.associate = function(models){
        Users.belongsTo(models.Positions,{foreignKey:"username"});
      }*/
      return Users;
  };