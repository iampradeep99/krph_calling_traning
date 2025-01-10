var express = require('express');
var router = express.Router();
const PROFILECONTROLLER = require('../controllers/profile')
const agentValidation = require('../validations/userValidation')
const authenticate = require('../middlewares/verifyUser')



// router.post('/getCountryStateCity', authenticate.verifyToken,PROFILECONTROLLER. )













module.exports = router;
