const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync("./seeders/data/user.json"));
    const users = data.map((element) => ({
      email: element.email,
      password: element.password,
      name: element.name,
      province: element.province,
      city: element.city,
      address: element.address,
      phone: element.phone,
      avatar: element.avatar,
      completed: element.completed,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
