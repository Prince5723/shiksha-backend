const express = require('express');
const { Course } = require('../models/courseModel');

const router = express.Router();

// Route to add a new course (admin only), not protecting the route yet.
router.post('/addCourse', async (req, res) => {
    try {
        const { class: userClass, title, lectures } = req.body;

        // Calculate lecture count based on the number of lectures provided
        const lectureCount = lectures ? lectures.length : 0;

        // Create a new course
        const newCourse = new Course({
            class: userClass,
            title,
            lectures,
            lectureCount
        });

        // Save the course to the database
        await newCourse.save();

        res.status(201).json({ message: "Course added successfully", course: newCourse });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
