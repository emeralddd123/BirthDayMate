const cron = require('node-cron');

const { sendBirthdayWishes } = require('./birthdayReminder')


function start() {
    console.log('background jobs detected!!!')
    // job1
    cron.schedule('0 7 * * *', () => {
        console.log('Running birthday wishes cron job...');
        sendBirthdayWishes();
    });

    //more jobs incoming    
}

module.exports = { start }