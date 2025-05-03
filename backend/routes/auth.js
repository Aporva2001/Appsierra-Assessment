const express= require('express');
const { getSignupController, getLoginController, postSignupController, postLoginController } = require('../controllers/auth');

const router= express.Router();



router.get('/login', getLoginController)

router.post('/login',postLoginController)

router.get('/',getSignupController)
router.post('/',postSignupController)

module.exports= router