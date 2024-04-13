const {Auth} = require("../../../models/v1/auth/authModel");
const {Snowflake} = require("@theinternetfolks/snowflake");
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
        const response = await Auth.create({
            _id: Snowflake.generate(),
            name, 
            email,
            password,
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
        if(password!==response.password){
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
        }
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

module.exports = {authSignup, authSignin}