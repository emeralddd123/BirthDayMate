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
    // Get today's date in the format MM-DD
    const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

    // Find users with birthdays today
    const usersWithBirthday = await User.find({ birthday: { $regex: today } });

    if (usersWithBirthday.length > 0) {
      // Compose and send birthday wishes email for each user
      usersWithBirthday.forEach(async (user) => {
        await sendBirthdayWish(user.email, user.username);
      });
    } else {
      console.log('No birthdays today.');
    }
  } catch (error) {
    console.error('Error sending birthday wishes:', error);
  }
}


// Schedule the function to run every day at 7:00 AM
cron.schedule('0 7 * * *', () => {
    console.log('Running birthday wishes cron job...');
    sendBirthdayWishes();
});


module.exports = { sendBirthdayWish };

