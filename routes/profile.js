var express = require('express');
var router = express.Router();
const PROFILECONTROLLER = require('../controllers/profile')
const agentValidation = require('../validations/userValidation')
const authenticate = require('../middlewares/verifyUser')



router.post('/assign', authenticate.verifyToken,PROFILECONTROLLER.assignProfile )
router.post('/assignPermission', authenticate.verifyToken,PROFILECONTROLLER.assignPermissionToProfile )














module.exports = router;
