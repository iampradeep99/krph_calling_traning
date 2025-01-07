var express = require('express');
var router = express.Router();
const USER = require('../controllers/user')
const agentValidation = require('../validations/userValidation')


router.post('/create', agentValidation.validateAgentData, USER.createAgent)


module.exports = router;
