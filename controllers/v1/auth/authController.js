const {Auth} = require("../../../models/v1/auth/authModel");
const {Snowflake} = require("@theinternetfolks/snowflake")

async function authSignup(req, res) {
    const { name, email, password } = req.body;

    try {
        const data = await Auth.create({
            _id: Snowflake.generate(),
            name, 
            email,
            password,
        })
        console.log(data);
        return res.status(200).json(
            {
                status: true,
                content: {
                    data: {
                        id: "1",
                        name: "aman",
                        email: "aman@gmail.com",
                        created_at: new Date(),
                    },
                    meta: {
                        access_token: "token",
                    }
                }
            }
        )
    } catch (error) {
        console.log(error);
        //if user exist
        // return res.status(400).json(
        //     {
        //         status: false,
        //         errors: [
        //             {
        //             param: "email",
        //             message: "User with this email address already exists.",
        //             code: "RESOURCE_EXISTS"
        //             }
        //         ]
        //         }
        // )
    }
}

module.exports = {authSignup}