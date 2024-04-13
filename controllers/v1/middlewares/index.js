const jwt = require('jsonwebtoken');
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
function isAuthenticated(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(400).json({
            status: false,
            errors: [
                {
                    message: "You need to sign in to proceed.",
                    code: "NOT_SIGNEDIN"
                }
            ]
        });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded);
        req.id = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({
            status: false,
            errors: [
                {
                    message: "You need to sign in to proceed.",
                    code: "NOT_SIGNEDIN"
                }
            ]
        });
    }
};

module.exports = {isAuthenticated};