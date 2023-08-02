const express = require('express')
const router = express.Router()
const catchAsync = require('../utilites/catcAsync')
const { render } = require('ejs');
const passport = require('passport');
const { storeReturnTo } = require('../middleawre')
const users = require('../controllers/users')


router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))


router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


router.get('/logout', users.logout);

module.exports = router;
