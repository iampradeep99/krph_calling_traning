var express = require('express');
var router = express.Router();
const USER = require('../controllers/user')
const agentValidation = require('../validations/userValidation')
const authenticate = require('../middlewares/verifyUser')


router.post('/create',  USER.createAgent)
router.post('/update',authenticate.verifyToken,agentValidation.validateAgentDataUpdate,  USER.updateAgent)
router.post('/allAgent',authenticate.verifyToken,  USER.agentList);
router.put('/status',authenticate.verifyToken,  USER.disableAgent);
router.post('/getById',authenticate.verifyToken,  USER.getUserById);
router.post('/statusUpdate',authenticate.verifyToken,  USER.statusUpdate);


router.post('/addUpdateTrainerOrAdmin',authenticate.verifyToken, agentValidation.validateAdminOrTrainerData,  USER.addUpdateAdminOrTrainer);
router.post('/addUpdateSupervisor',authenticate.verifyToken, agentValidation.validateSupervisorData,  USER.addUpdateSupervisor);
















module.exports = router;
