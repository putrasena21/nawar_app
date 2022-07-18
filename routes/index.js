const express = require("express");

const router = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");

const productRoutes = require("./product.routes");
const categoryRoutes = require("./category.routes");

const wishlistRoutes = require("./wishlist.routes");
const transactionRoutes = require("./transaction.routes");

const notificationRoutes = require("./notification.routes");
const whatsapp = require('./whatsapp.routes')

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(200).json({
    status: "Success",
    message: "Welcome to Final API v1",
  });
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

router.use("/wishlist", wishlistRoutes);
router.use("/transactions", transactionRoutes);

router.use("/notifications", notificationRoutes);
router.use("/wa", whatsapp)

module.exports = router;
