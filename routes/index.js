const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(200).json({
    status: "Success",
    message: "Welcome to Final API v1",
  });
});

router.use("/auth", authRoutes);

module.exports = router;
