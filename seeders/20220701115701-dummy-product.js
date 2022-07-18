const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync("./seeders/data/product.json"));
    const products = data.map((element) => ({
      userId: element.userId,
      name: element.name,
      price: element.price,
      description: element.description,
      size: element.size,
      published: element.published,
      sold: element.sold,
      soldAt: element.soldAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("Products", products);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
