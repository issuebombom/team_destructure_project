'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categorys', {
      categoryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      PostId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'postId',
        },
      },
      restaurants: {
        type: Sequelize.STRING,
      },
      game: {
        type: Sequelize.STRING,
      },
      trade: {
        type: Sequelize.STRING,
      },
      exercise: {
        type: Sequelize.STRING,
      },
      music: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categorys');
  },
};
