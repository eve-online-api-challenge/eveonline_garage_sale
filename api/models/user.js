module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    CharacterID:{
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    CharacterName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    netvalue: DataTypes.DOUBLE,
    keyID: DataTypes.STRING,
    vCode: DataTypes.STRING,
    refresh_token: DataTypes.STRING
  }, {
    classMethods:{
      associate: function(models){
      }
    }
  });
  return User;
};
