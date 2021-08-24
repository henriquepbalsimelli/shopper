'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     *  */
    await queryInterface.createTable('Pedidos_produtos', {
      id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      pedidoId:{
        type: Sequelize.INTEGER,
        allowNull:false,
        refereces:{model: 'Pedidos', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      produtoId:{
        type: Sequelize.INTEGER,
        allowNull:false,
        refereces:{model: 'Produtos', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantidade:{
        type: Sequelize.INTEGER,
        allowNull: false,
        
      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull: false,
        
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull: false,
        
      }

    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * */
     await queryInterface.dropTable('Pedidos_produtos');
     
  }
};