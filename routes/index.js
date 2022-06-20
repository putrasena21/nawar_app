const express = require("express");

const router = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(200).json({
    status: "Success",
    message: "Welcome to Final API v1",
  });
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
