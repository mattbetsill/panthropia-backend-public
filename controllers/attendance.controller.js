const attendanceService = require('../services/attendance.service');

module.exports = {
    addRecord,
    getRecords,
    getOrgRecords,
    getUserRecords,
    setUserAttendanceStatus,
    getS3UrlGet,
    getS3UrlPut,
    getNonAttendees,
    getOrgOnlyAttendance,
    deleteRecord,
    getEventAttendanceAnalysis
};

function addRecord(req, res, next) {

    attendanceService.addRecordn(req.body, req.user.sub)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function getRecords(req, res, next) {

    attendanceService.getRecords(req.query.param).then(records => res.json(records)).catch(err => next(err));
}

function getOrgRecords(req, res, next) {

    attendanceService.getOrgRecords(req.query.orgid).then(records => res.json(records)).catch(err => next(err));
}

function getUserRecords(req, res, next) {
    attendanceService.getUserRecords(req.query.user).then(records => res.json(records)).catch(err => next(err));
}

function setUserAttendanceStatus(req, res, next) {

    attendanceService.setUserAttendanceStatus(req.query.recordId, req.query.value, req.query.countBoth, req.query.field).then(records => res.json(records)).catch(err => next(err));
}

function getS3UrlPut(req, res, next) {
    attendanceService.getSignedS3Url(req.query.fileName, 'putObject').then(url => res.json(url)).catch(err => next(err));
}

function getS3UrlGet(req, res, next) {
    attendanceService.getSignedS3Url(req.query.fileName, 'getObject').then(url => res.json(url)).catch(err => next(err));
}

function getNonAttendees(req, res, next) {
    attendanceService.getNonAttendees(req.query.eventid, req.query.orgid).then(users => res.json(users)).catch(err => next(err));
}

function getOrgOnlyAttendance(req, res, next) {
    attendanceService.getOnlyOrgRecords(req.query.orgid).then(records => res.json(records)).catch(err => next(err));
}

function deleteRecord(req, res, next) {
    attendanceService.deleteRecord(req.query.id).then(record => res.json(record)).catch(err => next(err));
}

function getEventAttendanceAnalysis(req, res, next) {
    attendanceService.getEventAttendanceAnalysis(req.query.id).then(record => res.json(record)).catch(err => next(err));
}