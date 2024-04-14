const express = require("express");

const router = express.Router();

const authRouter = require("./auth");
const communityRouter = require("./community");
const memberRouter = require("./member");
const roleRouter = require("./role");

router.use("/auth", authRouter);
router.use("/community", communityRouter);
router.use("/member", memberRouter);
router.use("/role", roleRouter)

module.exports = router;