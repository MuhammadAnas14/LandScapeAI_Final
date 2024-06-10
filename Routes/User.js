const express = require('express')
const router  = express.Router();

const {login,SignUp} = require('../Controllers/User');

router.post("/register", SignUp);
router.post("/login" , login);

module.exports = router;