const express = require("express");
const { authSignup } = require("../../../controllers/v1/auth/authController");

const router = express.Router();

router.post("/signup", authSignup)

module.exports = router;