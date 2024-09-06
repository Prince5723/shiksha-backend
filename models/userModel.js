const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { Course } = require('./courseModel')

const userSchema = mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },

        fullName: String,

        class: Number,

        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }]
    }
)

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            phoneNumber: this.phoneNumber,
        },
        process.env.ACCESS_TOKEN_SECRET
    )
}

const User = mongoose.model("User", userSchema);

module.exports = User;