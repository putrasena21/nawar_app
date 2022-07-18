const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync("./seeders/data/wishlist.json"));
    const wishlist = data.map((element) => ({
      userId: element.userId,
      productId: element.productId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("Wishlists", wishlist);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Wishlists", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
