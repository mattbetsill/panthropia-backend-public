const excuseService = require('../services/excuse.service')

module.exports = {
    addExcuse,
    getUserExcuses,
    getOrgExcuses,
    deleteExcuse,
    editExcuse,
    getEventExcuses

};

function addExcuse(req, res, next) {
    return excuseService.addExcuse(req.user.sub, req.body).then(confirm => res.json(confirm)).catch(err => next(err));

}

function getUserExcuses(req, res, next) {
    return excuseService.getUserExcuses(req.user.sub).then(excuses => res.json(excuses)).catch(err => next(err));
}

function getOrgExcuses(req, res, next) {
    return excuseService.getOrgExcuses(req.query.orgId).then(excuses => res.json(excuses)).catch(err => next(err));
}

function deleteExcuse(req, res, next) {
    return excuseService.deleteExcuse(req.query.id).then(confirmation => res.json(confirmation)).catch(err => next(err))
}

function editExcuse(req, res, next) {
    return excuseService.editExcuse(req.body).then(excuse => res.json(excuse)).catch(err => next(err));
}

function getEventExcuses(req, res, next) {
    return excuseService.getEventExcuses(req.query.id, req.query.orgid).then(excuses => res.json(excuses)).catch(err => next(err));
}