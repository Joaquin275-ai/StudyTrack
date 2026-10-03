const express = require("express");
const authController = require("../controllers/auth.controller");
const limitadorLogin = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/registro", authController.registrar);
router.post("/login", limitadorLogin, authController.login);

module.exports = router;