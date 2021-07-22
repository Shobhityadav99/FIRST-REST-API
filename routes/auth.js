const express = require('express');
const { body } = require('express-validator/check');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');

const router = express.Router();

router.put('/signup',[
    body('email')
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value , { req }) => {
        return User.findOne({email: value}).then(userDoc => {
            if(userDoc){
                return Promise.reject("E-mail address already exists!");
            }
        })
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({min: 5}),
    body('name')
    .trim()
    .notEmpty(),
],authController.signUp)

router.post('/login',authController.login);

router.get('/status',isAuth,authController.getUserStatus);

router.patch('/status',isAuth,[
    body('status')
    .trim()
    .notEmpty()
],authController.updateUserStatus);

module.exports = router;