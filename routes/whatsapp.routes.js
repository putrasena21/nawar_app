const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const whatsapp = require("../controllers/whatsapp.controller");

router.get("/", authMiddleware.userAuth, whatsapp.redirect);

module.exports = router;
