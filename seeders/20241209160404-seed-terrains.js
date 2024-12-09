'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Terrains', [
      { nom: 'A', disponible: true, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'B', disponible: true, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'C', disponible: true, createdAt: new Date(), updatedAt: new Date() },
      { nom: 'D', disponible: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Terrains', null, {});
  },
};
