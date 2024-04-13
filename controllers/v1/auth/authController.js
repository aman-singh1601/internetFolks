const {Auth} = require("../../../models/v1/auth/authModel");
const {Snowflake} = require("@theinternetfolks/snowflake");
const bcrypt = require("bcrypt");
const { getResponseData, validateSignupAuthData, validateEmail } = require("../helperFunctions");



async function authSignup(req, res) {
    const { name, email, password } = req.body;
            
    let errors = validateSignupAuthData(name, password);
    if(Array.isArray(errors)) {
        return res.status(400).json({
            status: false,
            errors
        })
    }

    try {

        var existingUser = await Auth.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                    param: "email",
                    message: "User with this email address already exists.",
                    code: "RESOURCE_EXISTS"
                    }
                ]
            })
        }
        let hashPassword = await bcrypt.hash(password, 10);
        const response = await Auth.create({
            _id: Snowflake.generate(),
            name, 
            email,
            password: hashPassword,
        })


        let content = getResponseData(response);

        return res.status(200).json(
            {
                status: true,
                content: content
            }
        )
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: [
                {
                    param: "Server Error",
                    message: "Internal server error. Please try again!",
                    code: "RESOURCE_EXISTS"
                }
            ]
        })
        
    }
}

async function authSignin(req, res) {
    const {email, password} = req.body;

    let errors = validateEmail(email);
    if(Array.isArray(errors)) {
        return res.status(400).json({
            status: false,
            errors
        })
    }
    try {
        var response = await Auth.findOne({email});
        if(!response)
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: "email",
                        message: "User dosen't exist!",
                        code: "INVALID_CREDENTIALS"
                    }
                ]
            });
        if(await bcrypt.compare(password, response.password)){
            let content = getResponseData(response);

            return res.status(200).json(
                {
                    status: true,
                    content: content
                }
            );
            
        }
        return res.status(400).json({
            status: false,
            errors: [
                {
                    param: "password",
                    message: "The credentials you provided are invalid.",
                    code: "INVALID_CREDENTIALS"
                }
            ]
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: [
                {
                    param: "Server Error",
                    message: "Internal server error. Please try again!",
                    code: "RESOURCE_EXISTS"
                }
            ]
        })
    }
}

async function getMe(req, res) {
    const userId = req.id;
    
    try {
        const response = await Auth.findOne({
            _id: userId
        });
        if(!response) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: "email",
                        message: "User dosen't exist!",
                        code: "INVALID_CREDENTIALS"
                    }
                ]
            });
        }
        const {_id, name, email, createdAt} = response;
        const data = {
            id: _id,
            name,
            email,
            created_at: createdAt,
        }

        return res.status(200).json({
            status: true,
            content: {
                data : data
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: [
                {
                    param: "Server Error",
                    message: "Internal server error. Please try again!",
                    code: "RESOURCE_EXISTS"
                }
            ]
        })
        
    }
}
module.exports = {authSignup, authSignin, getMe};