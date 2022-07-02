const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync("./seeders/data/productCategory.json")
    );
    const productCategories = data.map((element) => ({
      categoryId: element.categoryId,
      productId: element.productId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("ProductCategories", productCategories);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductCategories", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
