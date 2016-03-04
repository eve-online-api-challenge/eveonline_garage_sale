module.exports = function(sequelize, DataTypes) {
  var Market = sequelize.define("Market", {
    id:{
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false
    },
    name: DataTypes.STRING,
    adjustedPrice: DataTypes.DOUBLE,
    averagePrice: DataTypes.DOUBLE
  }, {
    classMethods:{
      associate: function(models){
      }
    }
  });
  return Market;
};
