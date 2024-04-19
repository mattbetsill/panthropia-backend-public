const eventService = require('../services/event.service')

module.exports = {
    createEvent,
    getEvents,
    getOneEvent,
    deleteEvent,
    editEvent,
    getEventCreatedBy,
    getPrivOrgNames,
    getQr,
    removeQr,
    verifyQr
};


function createEvent(req, res, next) {
    eventService.addEvent(req.body, req.user.sub)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function getEvents(req, res, next) {


    eventService.getAllEvents(req.query.param, req.query.user, req.query.isOrg, req.query.isProfile, req.query.date)
        .then(events => {
            res.json(events);

        })
        .catch(err => next(err));
}

function getOneEvent(req, res, next) {
    eventService.getOneEvent(req.query.param)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function getEventCreatedBy(req, res, next) {
    eventService.getEventCreatedby(req.query.param)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function deleteEvent(req, res, next) {
    eventService.deleteEvent(req.query.param).then(event => res.json(event)).catch(err => next(err));
}
function editEvent(req, res, next) {

    eventService.editEvent(req.body.params.id, req.body.params.event).then(event => res.json(event)).catch(err => next(err));
}

function getPrivOrgNames(req, res, next) {
    eventService.getPrivOrgNames(req.query.eventId).then(names => res.json(names)).catch(err => next(err));
}

function getQr(req, res, next) {
    eventService.getQr(req.query.eventId, req.user.sub).then(code => res.json(code)).catch(err => next(err));
}

function removeQr(req, res, next) {
    eventService.removeQr(req.query.eventId, req.user.sub).then(complete => res.json(complete)).catch(err => next(err));
}

function verifyQr(req, res, next) {
    eventService.verifyQr(req.query.eventId, req.query.code).then(verified => res.json(verified)).catch(err => next(err));
}