const express = require('express');
const router = express.Router();
const {adminLogin,adminSignup,adminInform} = require('../controller/adminController');

router.post('/login', adminLogin);
router.post('/signup', adminSignup);
router.post('/inform',adminInform);

module.exports = router;
