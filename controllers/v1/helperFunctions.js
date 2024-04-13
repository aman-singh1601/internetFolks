const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
function generatetoken(tokenData) {
    var token = jwt.sign(tokenData, SECRET_KEY, { expiresIn: '3h' });
    return token;
}

function getResponseData(response) {
    let {_id, name, email, createdAt} = response;

    const tokenData = {name, email, id: _id};

    const token = generatetoken(tokenData);
    let data = {
        id: _id,
        name,
        email,
        created_at: createdAt,
    }
    let meta = {
        access_token: token,
    }

    return {data, meta};
}

function validateSignupAuthData(name, password) {
    console.log("name", name.length);
    console.log("password", password.length);
    if(name.length >= 2 && password.length >= 2) return true;

    if(name.length < 2 && password.length < 2) {
        return [
            {
                param: "name",
                message: "Name should be at least 2 characters.",
                code: "INVALID_INPUT"
            },
            {
                param: "password",
                message: "Password should be at least 2 characters.",
                code: "INVALID_INPUT"
            }
        ]
    }else if(name.length < 2) {
        return [
            {
                param: "name",
                message: "Name should be at least 2 characters.",
                code: "INVALID_INPUT"
            },
        ]
    }else if(password.length < 2) {
        return [
            {
                param: "password",
                message: "Password should be at least 2 characters.",
                code: "INVALID_INPUT"
            },
        ]
    }
}
function validateEmail(email) {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(!emailRegex.test(email)) {
        return [
            {
                param: "email",
                message: "Please provide a valid email address.",
                code: "INVALID_INPUT"
            }
        ]
    }
    return true;
}




module.exports = {
    getResponseData,
    generatetoken,
    validateSignupAuthData,
    validateEmail
};

// _id: '7184889420447937504',
// name: 'aman',
// email: 'aman16singh2001@gmail.com',
// password: 'aman1234',
// createdAt: 2024-04-13T12:25:26.636Z,
// updatedAt: 2024-04-13T12:25:26.636Z,
// __v: 0
// }