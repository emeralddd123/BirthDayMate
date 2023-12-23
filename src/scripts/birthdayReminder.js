const handlebars = require('handlebars');
const cron = require('node-cron')
const fs = require('fs').promises;

const { sendMail, emailConfig } = require('../services/emailService');
const User = require('../models/user');


async function sendBirthdayWish(email, username) {
    try {
        const templatePath = './src/templates/birthdayTemplate.hbs';
        const template = await fs.readFile(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(template);

        const mailOptions = {
            from: emailConfig.auth.user,
            to: email,
            subject: 'Happy Birthday!',
            html: compiledTemplate({ username })
        };

        await sendMail(mailOptions);
        console.log(`Birthday wishes sent to ${username} (${email})`);
    } catch (error) {
        console.error('Error sending birthday wish:', error);
    }
}

async function sendBirthdayWishes() {
    try {
        // Get the current date without the time (set hours, minutes, seconds, and milliseconds to zero)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Get the date for the beginning of the next day
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find users with birthdays today
        const usersWithBirthday = await User.find({
            birthday: {
                $gte: today,
                $lt: tomorrow
            }
        });

        if (usersWithBirthday.length > 0) {
            // Compose and send birthday wishes email for each user
            for (const user of usersWithBirthday) {
                await sendBirthdayWish(user.email, user.username);
            }
        } else {
            console.log('No birthdays today.');
        }
    } catch (error) {
        console.error('Error sending birthday wishes:', error);
    }
}





module.exports = { sendBirthdayWish, sendBirthdayWishes };

