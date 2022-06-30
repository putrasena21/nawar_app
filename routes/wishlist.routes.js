const express = require("express");

const router = express.Router();

const passport = require("../lib/passport");
const wishlistController = require("../controllers/wishlist.controller");

router.post("/add", wishlistController.addWishlist);
router.get("/detail/:wishlistId", wishlistController.getDetail);
router.get(
  "/",
  [passport.authenticate("jwt", { session: false })],
  wishlistController.getWishlist
);
router.put("/update/:id", wishlistController.updateWishlist);
router.delete("/delete/:wishlistId", wishlistController.deleteWishlist);

module.exports = router;
