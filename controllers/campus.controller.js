
const campusService = require('../services/campus.service')

module.exports = {
    addCampus,
    getCampuses,
    getOneCampus,
    patchCampus
};

function addCampus(req, res, next) {
    campusService.addCampus(req.body).then(campus => res.json(campus)).catch(err => next(err));
}

function getCampuses(req, res, next) {
    campusService.getCampuses().then(campus => res.json(campus)).catch(err => next(err));
}

function getOneCampus(req, res, next) {
    campusService.getOneCampus(req.query.name).then(campus => res.json(campus)).catch(err => next(err));
}

function patchCampus(req, res, next) {
    campusService.patchCampus(req.query.id, req.body).then(campus => res.json(campus)).catch(err => next(err));
}
