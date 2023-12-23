const express = require('express')

const router = express.Router()
const emailService = require('.././services/emailService')
const {sendBirthdayWish} = require('.././scripts/birthdayReminder')

const userService = require('.././services/userService');
const { validUserCreation } = require('.././middlewares/userMiddleware');



router.post('/signup', validUserCreation, async (req, res) => {
    try {
        const userData = req.body
        const result = await userService.signup(userData);

        if (result.status === 201) {
            res.status(result.status).json({ message: result.message });
        } else if (result.status === 400) {
            res.status(result.status).json({ error: result.message });
        }
        else {
            res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/test/102938', async (req, res) => {
    try {
        const testData = { email, username} = req.body
        sendBirthdayWish(email, username)
        return res.status(200).json({message: `An Email has been sent to ${email}`})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router