const userService = require('../services/user.service')


module.exports = {
    authenticate,
    getAllUsers,
    register,
    editUser,
    editUserOrg,
    getOrgMembers,
    setIndependent,
    recoverUsernameEmail,
    resetPasswordEmail,
    resetPassword,
    editUsersEmail,
    editUsersUsername


};


function authenticate(req, res, next) {

    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}


function getAllUsers(req, res, next) {

    userService.getAllUsers()
        .then(users => res.json(users))
        .catch(err => next(err));
}


function register(req, res, next) {

    userService.addUser(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function editUser(req, res, next) {
    userService.editUser(req.body, req.user.sub).then((user) => res.json(user)).catch(err => next(err));
}

function editUserOrg(req, res, next) {
    userService.editUserOrg(req.body, req.user.sub, req.query.orgref).then((user) => res.json(user)).catch(err => next(err));
}

function getOrgMembers(req, res, next) {
    userService.getOrgMembers(req.query.orgref).then((user) => res.json(user)).catch(err => next(err));
}

function setIndependent(req, res, next) {
    userService.setIndependent(req.query.userref).then((user) => res.json(user)).catch(err => next(err));
}

function recoverUsernameEmail(req, res, next) {
    userService.recoverUsernameEmail(req.query.email).then((emailpresent) => res.json(emailpresent)).catch(err => next(err));
}

function resetPasswordEmail(req, res, next) {
    userService.resetPasswordEmail(req.query.email).then((emailpresent) => res.json(emailpresent)).catch(err => next(err));
}

function resetPassword(req, res, next) {
    userService.resetPassword(req.query.password, req.query.code).then((success) => res.json(success)).catch(err => next(err));
}

function editUsersEmail(req, res, next) {
    userService.editUsersEmail().then((success) => res.json(success)).catch(err => next(err));
}

function editUsersUsername(req, res, next) {
    userService.editUsersUsername().then((success) => res.json(success)).catch(err => next(err));

}