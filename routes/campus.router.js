const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campus.controller');

router.post('/addCampus', campusController.addCampus);
router.get('/getCampuses', campusController.getCampuses);
router.get('/getOneCampus', campusController.getOneCampus);
router.post('/patchCampus', campusController.patchCampus);

module.exports = router;
