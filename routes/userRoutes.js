const express = require('express');
const verifyJWT = require('../middlewares/authMiddleware');
const { Course } = require("../models/courseModel")

const router = express.Router();

const assignCourse = async (userClass) => {
    const course = Course.findOne({
        class: userClass
    })

    return course;


}

router.put('/updateUserInfo', verifyJWT, async (req, res) => {

    try {
        const user = req.user;
        user.fullName = req.body.fullName;
        user.class = req.body.class;
        user.courses = await assignCourse(user.class);

        await user.save();

        res.status(200).send("User information updated successfully")
    }
    catch (error) {
        console.error("Error updating user information:", error);
        res.status(500).json({ message: "Server error while updating user information" });
    }


})

router.get('/getUserCourse', verifyJWT, async (req, res) => {
    const user = req.user;
    await user.populate('courses')

    const userCourse = user.courses;
    res.json({ userCourse })

})

module.exports = router;