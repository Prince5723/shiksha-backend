const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.log(token);
        if (!token) {
            res.status(401).send('Not sending the accessToken')
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {

            res.status(401).send('You are not Authorized')
        }

        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        res.json({
            msg: 'Some problem occured wile verifying accessToken'
        })
    }

}

module.exports = verifyJWT;