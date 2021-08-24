'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     *  */
    await queryInterface.createTable('Pedidos', {
      id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        
      },
      nomeCliente:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      dataDeEntrega:{
        type: Sequelize.DATE
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
     await queryInterface.dropTable('Pedidos');
     
  }
};
