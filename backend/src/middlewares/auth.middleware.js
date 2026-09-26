const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authUser( req,res, next){

    const {chatNovaToken} = req.cookies;

    if(!chatNovaToken){
       return res.status(401).json({message : "Unauthorized User"});
    }

    try {
        const decoded = jwt.verify(chatNovaToken,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({message: "User no longer exists"});
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({message : "Unauthorized User"})
    }
}


module.exports ={
    authUser
}