const User = require('.././models/user');
const emailService = require('./emailService')

require('dotenv').config();

const signup = async function (userData) {
    try {

        const existingEmail = await User.findOne({ email: userData.email });

        if (existingEmail) {
            return { status: 409, message: "Email already exists" };
        }

        const newUser = await User.create({
            email: userData.email,
            username: userData.username,
            password: userData.password,
            birthday: userData.birthday
        });

        // emailService.sendActivationMail(userData.email, userData.username, activationToken)

        delete newUser.password;


        return { status: 201, message: `success, account registered succesfully!!!` };
    } catch (error) {
        console.log(error);
        return { status: 500, message: error };
    }
}


const userService = { signup }

module.exports = userService