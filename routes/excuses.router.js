const express = require('express');
const router = express.Router();
const excuseController = require('../controllers/excuse.controller');

router.post('/addExcuse', excuseController.addExcuse);
router.get('/getUserExcuses', excuseController.getUserExcuses);
router.get('/getOrgExcuses', excuseController.getOrgExcuses);
router.delete('/deleteExcuse', excuseController.deleteExcuse);
router.post('/editExcuse', excuseController.editExcuse);
router.get('/getEventExcuses', excuseController.getEventExcuses);
module.exports = router;