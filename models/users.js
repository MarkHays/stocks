module.exports = function(sequelize, DataTypes) {
      var Users = sequelize.define("Users", {
                    user_id: {
                      type:DataTypes.STRING,
                      primaryKey:true
                    },
                    name: DataTypes.STRING,
                    budget: DataTypes.INTEGER
        },{
          timestamps : false
        });
        Users.associate = function(models){
            Users.hasMany(models.Positions,{foreignKey:"user_id"});
        }
      return Users;
  };