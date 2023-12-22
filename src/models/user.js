const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
});

UserSchema.pre('save', async function (next) {
    // Hash the password before saving it to the database
    if (this.isModified('password') || this.isNew) {
        const hashedpassword = await bcrypt.hash(this.password, 10);
        this.password = hashedpassword;
    }
    next();
});

UserSchema.methods.isValidPassword = async function (password) {
    // Check if the entered password is valid
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};


const User = mongoose.model("User", UserSchema);

module.exports = User;
