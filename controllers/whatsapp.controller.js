const { User } = require("../models");

module.exports = {
  redirect: async (req, res) => {
    try {
      const { buyerId } = req.body;

      const user = await User.findOne({
        where: {
          id: buyerId,
        },
      });
      const link = `https://wa.me/${user.phone}`;

      return res.success("Success generate whatsapp link", link);
    } catch (err) {
      return res.serverError();
    }
  },
};
