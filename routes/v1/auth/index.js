const express = require("express");
const { authSignup, authSignin } = require("../../../controllers/v1/auth/authController");

const router = express.Router();

router.post("/signup", authSignup);
router.post("/signin", authSignin);

module.exports = router;