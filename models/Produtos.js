'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produtos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Pedidos, {
          foreignKey: 'pedidoId',
          through: 'Pedidos_produtos',
          as: 'pedidos'
      })
    }
  };
  Produtos.init({
    name: {
      type: DataTypes.STRING,
      allowNull:false,

    },
    price:{
      type: DataTypes.FLOAT,
      allowNull:false
    },
    qty_stock:{
        type: DataTypes.INTEGER
    }

  }, {
    sequelize,
    modelName: 'Produtos',
  });
  return Produtos;
};