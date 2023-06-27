'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Likes 테이블 DB에 생성
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId', // 외래 키
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      PostId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'postId', // 외래 키
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
  // Likes 테이블 삭제
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Likes');
  },
};
