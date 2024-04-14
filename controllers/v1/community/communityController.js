const { Snowflake } = require("@theinternetfolks/snowflake");
const { Community, Member, Role, Auth} = require("../../../models/v1");
async function createCommunity(req, res) {
    const { name: communityName} = req.body;
    const userId = req.id;
    const slug = communityName.toLowerCase();

    //create a community
    try {
        const userCommunity = new Community({
            _id: Snowflake.generate(),
            name: communityName,
            slug,
            owner: userId
        });
        const community = await userCommunity.save();

        const {_id: roleId} = await Role.findOne({
            name: "Community Admin"
        });


        if(roleId) {
        const userMember =  await Member.create({
            _id: Snowflake.generate(),
            community: community._id,
            user: userId,
            role: roleId
        });

        const { _id, name, owner, createdAt, updatedAt } = community;

        const data = {
            id: _id,
            name,
            owner,
            created_at: createdAt,
            updated_at: updatedAt
        }
        

        return res.status(200).json({
            status: true,
            content: {
                data: data,
            }
        })

        }


        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            errors: [
                {
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        });
    }
}

async function getCommunity(req, res) {
try {
    //total
    const page = parseInt(req.query.page) || 0;
    const pages = parseInt(req.query.pages) || 1;
    const total = await Community.countDocuments().exec();

    let limit = 3;

    let startIndex = page * limit;


    const response = await Community.find()
    .sort("createdAt")
    .skip(startIndex)
    .limit(limit)
    .populate("owner", "_id name");



    if(response){
        console.log(response);

        let data = response.map(community => {
            return {
                id: community._id,
                name: community.name,
                slug: community.slug,
                owner: {
                    id: community.owner._id,
                    name: community.owner.name
                },
                createdAt: community.createdAt,
                updatedAt: community.updatedAt
            }
        });
        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages,
                    page
                },
                data
            },
        })
    }

} catch (error) {

    res.status(500).json({
        status: false,
        errors: [
            {
                message: "Internal Server Error",
                code: "SERVER_ERROR"
            }
        ]
    });
}
}

async function getMembers(req, res) {

    const { id} = req.params;
    console.log(id);
    try {
        const page = parseInt(req.query.page) || 1;
        const pages = parseInt(req.query.pages) || 1;
        let limit = 3;

        let startIndex = page * limit;
        const response = await Member.find({community: id})
        .sort("createdAt")
        .skip(startIndex)
        .limit(limit)
        .populate("user", "_id name")
        .populate("role", "_id name");
        if(response) {
        const total = response.length;
        
        let data = response.map(member => {
            return {
                id: member._id,
                community: member._community,
                user: {
                    id: member.user._id,
                    name: member.user.name
                },
                role: {
                    id: member.role._id,
                    name: member.role.name
                }
            }
        });
        
        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages,
                    page
                },
                data
            },
        })
        }
        
        
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: [
                {
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        });
    }
}
async function getOwnedCommunity (req, res) {
    const userId = req.id;

    try {
        let page = parseInt(req.query.page) || 0;
        let pages = parseInt(req.query.pages) || 1;
        let limit = 10;
        let startIndex = page * limit;
        // let response = await Community.find({ owner: userId});
        let response = await Community.find({ owner: userId});

        //pagination to be added

        let data = response.map(community => {
            return {
                id: community._id,
                name: community.name,
                slug: community.slug,
                owner: community.owner,
                created_at: community.createdAt,
                updated_at: community.updatedAt
            }
        })

        let total = data.length;
        pages = Math.floor(total / limit);

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages,
                    page
                },
                data
            },
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: [
                {
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        });
    }

}

async function getJoinedCommunity (req, res) {
    const userId = req.id;

    try {
        // let response = await Community.find({ owner: userId});
        let response = await Member.find({ user: userId})
        .sort("createdAt")
        .populate("role")
        .populate("community")
        .populate({
            path: "community",
            populate: {
                path: "owner",
                model: "auth",
            }
        });
        //pagination to be added

        if(response) {
            let data = response.filter(member => member.community.owner._id !== userId).map(member => ({
                id: member.community._id,
                name: member.community.name,
                slug: member.community.slug,
                owner: {
                    id: member.community.owner._id,
                    name: member.community.owner.name,
                },
                created_at: member.community.createdAt,
                updated_at: member.community.updatedAt
            }));
            let limit = 10;
            let total = data.length;
            let pages = total / limit;
            let page = 0;
    
            return res.status(200).json({
                status: true,
                content: {
                    meta: {
                        total,
                        pages,
                        page
                    },
                    data: data
                },
            })
                
        }  
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: [
                {
                    message: "Internal Server Error",
                    code: "SERVER_ERROR",
                    error: error
                }
            ]
        });
    }
}

module.exports = {createCommunity, getCommunity, getMembers, getOwnedCommunity, getJoinedCommunity};
