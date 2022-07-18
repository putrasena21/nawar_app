const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync("./seeders/data/notification.json")
    );
    const wishlist = data.map((element) => ({
      providerId: element.providerId,
      receiverId: element.receiverId,
      read: element.read,
      status: element.status,
      notifDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("Notifications", wishlist);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Notifications", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
