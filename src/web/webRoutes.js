const express = require('express');
const path = require('path');

const userService = require('../services/userService')
const emailService = require('.././services/emailService')


const webRouter = express.Router();

webRouter.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});


webRouter.get('/home', async (req, res) => {
    try {
        return res.render('home')
    } catch (error) {
        res.redirect('/errorPage')
    }
})


webRouter.get('/signup', async (req, res) => {
    let message
    let user = req.user
    if (user) {
        return res.redirect('/home')
    }
    res.render('signup', { message, user })
})


webRouter.post('/signup', async (req, res) => {
    try {
        let user = req.user
        const userData = { username, email, password, birthday } = req.body

        const response = await userService.signup(userData)

        if (response.status === 409) {
            return res.render('signup', { message: response.message, user })
        } else if (response.status === 201) {

            // emailService.sendOnBoardingMailOrWhatever
            return res.redirect('/home')
        } else {
            return res.render('signup', { message: response.message, user })
        }
    } catch (error) {
        res.redirect('/errorPage') //, { error: error }
    }
})



module.exports = webRouter;