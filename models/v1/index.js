const { Community} = require("./community/communityModel.js");
const { Role} = require("./role/roleModel.js");
const { Auth} = require("./auth/authModel.js");
const { Member} = require("./member/memberModel.js");

module.exports = {Auth, Role, Community, Member};