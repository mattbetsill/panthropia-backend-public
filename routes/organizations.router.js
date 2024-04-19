const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizations.controller');

router.post('/addorg', orgController.addOrg);
router.get('/getAllOrgs', orgController.getOrgs);
router.get('/getFeaturedOrg', orgController.getFeatured);
router.get('/getOrgByName', orgController.getOrgName);
router.post('/editOrg', orgController.editOrg);
router.get('/patchOrgName', orgController.patchOrgName);


module.exports = router;
