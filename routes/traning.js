var express = require('express');
var router = express.Router();
const TRAININGCONTROLLER = require('../controllers/traning')
const traningValidation = require('../validations/traningValidation')
const authenticate = require('../middlewares/verifyUser')


router.post('/create', authenticate.verifyToken,traningValidation.validateTraningData, TRAININGCONTROLLER.create)
router.post('/listTrainings', authenticate.verifyToken, TRAININGCONTROLLER.allTraning)













module.exports = router;
