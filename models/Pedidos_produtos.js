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
            /**/this.belongsTo(models.Pedidos, {
                foreignKey: 'pedidoId',
                as: 'pedido'
                
            }),
                this.belongsTo(models.Produtos, {
                    foreignKey: 'produtoId',
                    as: 'produto'
                    
                })
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