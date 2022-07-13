const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync("./seeders/data/transaction.json"));
    const wishlist = data.map((element) => ({
      buyerId: element.buyerId,
      productId: element.productId,
      bidPrice: element.bidPrice,
      status: element.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("Transactions", wishlist);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Transactions", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
