var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.get('/allusers', userController.getAllUsers);
router.post('/edit', userController.editUser);
router.post('/edituserorg', userController.editUserOrg);
router.get('/getOrgMembers', userController.getOrgMembers);
router.get('/setIndependent', userController.setIndependent);
router.get('/resetPasswordEmail', userController.resetPasswordEmail);
router.get('/recoverUsernameEmail', userController.recoverUsernameEmail);
router.get('/resetPassword', userController.resetPassword);
router.get('/editUsersEmail', userController.editUsersEmail);
router.get('/editUsersUsername', userController.editUsersUsername);
module.exports = router;
