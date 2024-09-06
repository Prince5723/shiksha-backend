const express = require('express')
const router = express.Router();
const dotenv = require('dotenv')
const speakeasy = require('speakeasy');
const twilio = require('twilio')
const User = require('../models/userModel')

dotenv.config()

// Twilio credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

router.post('/send-otp', (req, res) => {
    const { phoneNumber } = req.body;

    // Generate OTP
    const otp = speakeasy.totp({ secret: process.env.SPEAKEASY_SECRET, encoding: 'base32' });
    console.log(otp)

    // res.send("look into console")

    // Send OTP via Twilio SMS

    client.messages.create({
        body: `Your OTP code for Shiksha verification is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    })
        .then((message) => {
            res.status(200).send(`OTP sent to ${phoneNumber}`);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send('Failed to send OTP');
        });
});

router.post('/verify-otp', async (req, res) => {
    const { otp, phoneNumber } = req.body;
    // console.log('user sent this otp: ' + otp)

    const verified = speakeasy.totp.verify({
        secret: process.env.SPEAKEASY_SECRET,
        encoding: 'base32',
        token: otp
    });

    // console.log(verified)

    if (verified) {

        const foundUser = await User.findOne({
            phoneNumber
        });

        if (foundUser) {
            const userCourses = foundUser.courses;
            console.log(userCourses);

            const accessToken = foundUser.generateAccessToken();

            res.status(200).json({
                userCourses,
                accessToken
            })
        }

        else {
            const user = await User.create({
                phoneNumber
            });

            const accessToken = user.generateAccessToken();

            res.status(200).json({
                msg: 'User created successfully, update your details now',
                accessToken
            })
        }

    } else {
        res.status(400).send('Invalid OTP');
    }
});



module.exports = router;