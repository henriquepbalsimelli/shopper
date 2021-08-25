'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedidos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Produtos, {
        foreignKey: 'produtoId',
        through: 'Pedidos_produtos',
        as: 'produtos'
    })
    }
  };
  Pedidos.init({
    nomeCliente: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    dataDeEntrega:{
      type: DataTypes.DATE,
      allowNull:false
    },
    total: DataTypes.FLOAT
    

  }, {
    sequelize,
    modelName: 'Pedidos',
  });
  return Pedidos;
};