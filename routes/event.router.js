const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

router.post('/addevent', eventController.createEvent);
router.get('/getCampusEvents', eventController.getEvents);
router.get('/getEvent', eventController.getEventCreatedBy);
router.delete('/deleteEvent', eventController.deleteEvent);
router.get('/getSingleEvent', eventController.getOneEvent);
router.post('/editEvent', eventController.editEvent);
router.get('/getPrivOrgNames', eventController.getPrivOrgNames);
router.get('/getQr', eventController.getQr);
router.get('/removeQr', eventController.removeQr);
router.get('/verifyQr', eventController.verifyQr);
module.exports = router;
