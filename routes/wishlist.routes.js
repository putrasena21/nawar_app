const { application } = require("express");
const express = require("express");
const router = express.Router();

const wishlistController = require('../controllers/wishlist.controller');

router.post('/add-wishlist', wishlistController.addWishlist);
router.get('/get-wishlist', wishlistController.getWishlist);
router.get('/detail-wishlist/:id', wishlistController.getDetail);
router.put('/update-wishlist/:id', wishlistController.updateWishlist);
router.delete('/delete-wishlist/:id', wishlistController.deleteWishlist);



module.exports = router;