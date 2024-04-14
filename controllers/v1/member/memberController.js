const { Snowflake } = require("@theinternetfolks/snowflake");
const { Auth, Community, Member, Role } = require("../../../models/v1");

async function addMember(req, res) {
    const {community: communityId, user: newUserId, role: roleId} = req.body;
    const userId = req.id;
    console.log(userId);
    try {

        const userOwnedCommunity = await Community.findOne({
            _id: communityId
        });
        console.log(userOwnedCommunity);
        if(userOwnedCommunity.owner !== userId) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: "community",
                        message: "You are not the owner of this community",
                        code: "NOT_ALLOWED_ACCESS"
                    }
                ]
            })
        }

        const newMember = await Member.create({
            _id: Snowflake.generate(),
            community: communityId,
            user: newUserId,
            role: roleId
        });
        
        const {_id, community, role, user, createdAt} = newMember;
        let data = {
            id: _id,
            community,
            user,
            role,
            created_at: createdAt
        };

        return res.status(200).json({
            status: true,
            content: {
                data
            }
        });

    } catch (error) {
        console.log(error);
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
async function removeMember(req, res) {
    const memberId = req.params.id;
    // const ownerId = req.id;

    try {
        const member = await Member.deleteOne({
            _id: memberId
        })
        if(!member) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        message: "Member not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
        }

        return res.status(200).json({
            status: true
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
        });
    }

}

module.exports = {addMember, removeMember};