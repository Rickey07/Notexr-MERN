const express = require('express');
const User = require('../Models/User');
const router = express.Router();
const {body,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const JWT_SECRET = "orandlohhjadhf45"


// Create a user using POST:- "/api/auth" , It doesn't require authentication
router.post('/newregistration' ,[
    body('email').isEmail(),
    body('name').isLength({min:5}),
    body('password').isLength({min:6})
], async (req ,res)  => {
    try {
        // Errors validation in route if any then return those.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }
        // Check if the user already exists with email.
        let user = await User.findOne({email:req.body.email})
        if (user) {
            return res.status(400).json({error:`user with this ${req.body.email} Already exists`})
        } else {
            const salt = await bcrypt.genSalt(10);
            let securePassword = await bcrypt.hash(req.body.password,salt);
            user = User({...req.body,password:securePassword});
            await user.save();
            const data = {
                user:{
                    id:user.id
                }
            }

            const authToken = jsonWebToken.sign(data,JWT_SECRET)
            res.status(200).json({authToken,msg:"User Created Successfully"});
        }

    } catch (error) {
         res.status(400).json({error: `Please enter a unique Value For Email ${error.key}`})
    }
});

module.exports = router;