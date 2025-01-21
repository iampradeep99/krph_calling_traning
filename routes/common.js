var express = require('express');
var router = express.Router();
const COMMONCONTROLLER = require('../controllers/common')
const agentValidation = require('../validations/userValidation')
const authenticate = require('../middlewares/verifyUser')



router.post('/getCountryStateCity', authenticate.verifyToken,COMMONCONTROLLER.getCountryStateCity )
router.post('/getLanguage', authenticate.verifyToken,COMMONCONTROLLER.getAllLanguages )
router.post('/getTraningModes', authenticate.verifyToken,COMMONCONTROLLER.getAllModes )
router.post('/getTraningModules', authenticate.verifyToken,COMMONCONTROLLER.getTraningModules )

router.post('/addMenu', COMMONCONTROLLER.addMenu)
router.post('/addSubmenu', COMMONCONTROLLER.addSubmenu)
router.post('/getMenu', COMMONCONTROLLER.getMenuWithSubmenus)
router.post('/addProfile', COMMONCONTROLLER.addProfile)
router.post('/addRegion', COMMONCONTROLLER.addRegion)













module.exports = router;
