const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, "Username is required"],
        },
        email: {
            type: String,
            require: [true, "Email is required"],
            unique: [true, "Email address aleeady used"],
        },
        password: {
            type: String,
            require: [true, "Password is required"]
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);