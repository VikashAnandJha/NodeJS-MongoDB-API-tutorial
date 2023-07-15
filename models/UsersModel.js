const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    uid: String,
    email: String,
    name: String,
    password: String,
    token: String,
    createdAt: Date
})

const UserModel = mongoose.model("Users", UserSchema)

module.exports = UserModel;