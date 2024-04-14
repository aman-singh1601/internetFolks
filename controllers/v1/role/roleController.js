const { Snowflake } = require("@theinternetfolks/snowflake");
const { Role } = require("../../../models/v1");

async function createRole (req, res) {
    const { name: userName} = req.body;


    if(userName.length < 2 )
        return res.status(400).json({
            status: false,
            errors: [
                {
                    param: "name",
                    message: "Name must be at least 2 characters long!",
                    code: "INVALID_PARAM"
                }
            ]
        })
    try {
        const response = await Role.create({
            _id: Snowflake.generate(),
            name: userName
        });
        const {_id, name, createdAt, updatedAt} = response;
        let data = {
            id: _id,
            name,
            created_at: createdAt,
            updated_at: updatedAt
        }
        return res.status(200).json({
            status: true,
            content: {
                data
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            errors: [
                {
                    param: "Server Error",
                    message: "Internal server error. Please try again!",
                    code: "RESOURCE_EXISTS",
                }
            ]
        })
    }
}

async function getAllRoles(req, res) {
    try {
        const response = await Role.find({});

        let data = response.map(role => {
            return {
                id: role._id,
                name: role.name,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt
            }
        })

        return res.status(200).json({
            status: true,
            content: {
                data
            }
        })
    } catch (error) {

        return res.status(500).json({
            status: false,
            errors: [
                {
                    param: "Server Error",
                    message: "Internal server error. Please try again!",
                    code: "RESOURCE_EXISTS",
                }
            ]
        })
    }
}

module.exports = {createRole, getAllRoles};