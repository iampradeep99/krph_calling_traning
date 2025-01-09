var express = require('express');
var router = express.Router();
const USER = require('../controllers/user')
const agentValidation = require('../validations/userValidation')
const authenticate = require('../middlewares/verifyUser')


router.post('/create',agentValidation.validateAgentData,  USER.createAgent)
router.post('/update',authenticate.verifyToken,agentValidation.validateAgentDataUpdate,  USER.updateAgent)
router.post('/allAgent',authenticate.verifyToken,  USER.agentList);
router.put('/status',authenticate.verifyToken,  USER.disableAgent);











module.exports = router;
