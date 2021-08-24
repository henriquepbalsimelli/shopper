'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Pedidos_produtos extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            /*this.belongsToMany(models.Pedidos, {
                foreignKey: 'pedidoId',
                through: 'Pedidos_produtos',
                as: 'pedidos'
            }),
                this.belongsToMany(models.Produtos, {
                    foreignKey: 'produtoId',
                    through: 'Pedidos_produtos',
                    as: 'produtos'
                })*/
        }
    };
    Pedidos_produtos.init({
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        include:[
            {associate: 'produtos'},
            {associate:'pedidos'}
        ]

    }, {
        sequelize,
        modelName: 'Pedidos_produtos',
    });
    return Pedidos_produtos;
};