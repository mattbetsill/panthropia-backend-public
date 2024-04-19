const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.post('/postAttendance', attendanceController.addRecord);
router.get('/getEventAttendance', attendanceController.getRecords);
router.get('/getOrgAttendance', attendanceController.getOrgRecords);
router.get('/getUserAttendance', attendanceController.getUserRecords);
router.get('/setUserAttendanceStatus', attendanceController.setUserAttendanceStatus);
router.get('/s3GetUrl', attendanceController.getS3UrlGet);
router.get('/s3PutUrl', attendanceController.getS3UrlPut);
router.get('/getNonAttendees', attendanceController.getNonAttendees);
router.get('/getOnlyOrgAttendance', attendanceController.getOrgOnlyAttendance);
router.get('/deleteRecord', attendanceController.deleteRecord);
router.get('/getEventAttendanceAnalysis', attendanceController.getEventAttendanceAnalysis);
module.exports = router;
