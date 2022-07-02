const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync("./seeders/data/productImage.json")
    );
    const productImages = data.map((element) => ({
      productId: element.productId,
      url: element.url,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("ProductImages", productImages);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductImages", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
