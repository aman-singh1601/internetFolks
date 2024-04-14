const express = require("express");
const { getJoinedCommunity, getOwnedCommunity} = require("../../../../controllers/v1/community/communityController.js");

const router = express.Router();

router.get("/owner", getOwnedCommunity);
router.get("/member", getJoinedCommunity);

module.exports = router;