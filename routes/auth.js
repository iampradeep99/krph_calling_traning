var express = require('express');
var router = express.Router();
const authService = require('../controllers/auth')
const validation = require('../validations/loginValidation')
// const UserService = require('../services/user')
/* GET users listing. */
router.post('/login', validation.validateLogin, authService.login)
module.exports = router;
