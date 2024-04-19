const orgService = require('../services/organizations.service')

module.exports = {
    addOrg,
    getOrgs,
    getFeatured,
    getOrgName,
    editOrg,
    patchOrgName
};


function addOrg(req, res, next) {
    orgService.addOrg(req.body, req.user.sub)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function getOrgs(req, res, next) {

    orgService.getAllOrgs(req.query.campus)
        .then(events => res.json(events))
        .catch(err => next(err));
}

function getFeatured(req, res, next) {

    orgService.getFeaturedOrg(req.query.campus)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function getOrgName(req, res, next) {
    orgService.getOrgByName(req.query.id)
        .then(org => res.json(org))
        .catch(err => next(err));
}

function editOrg(req, res, next) {
    orgService.editOrg(req.body.params.profile, req.user.sub).then(org => res.json(org)).catch(err => next(err));
}

function patchOrgName(req, res, next) {
    orgService.patchOrgName(req.query.campus, req.query.id, req.query.newName).then(org => res.json(org)).catch(err => next(err));
}
