const mongoose = require('mongoose');

const lectureSchema = mongoose.Schema({
    title: String,
    videoUrl: String
})


const courseSchema = mongoose.Schema({
    class: {
        type: Number,
        required: true
    },

    title: String,

    lectures: [lectureSchema],

    lectureCount: Number
})

const Course = mongoose.model('Course', courseSchema);
const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = { Course, Lecture };