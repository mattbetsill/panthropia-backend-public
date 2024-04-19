const db = require('../_helpers/database');
const Attendance = db.Attendance;
const Event = db.Event;
const User = db.User;
var AWS = require('aws-sdk')
var mongoose = require('mongoose');
const { Organization, Excuses } = require('../_helpers/database');
const { ObjectId } = require('mongodb');
module.exports = {
    addRecordn,
    getRecords,
    getOrgRecords,
    getUserRecords,
    setUserAttendanceStatus,
    getSignedS3Url,
    getNonAttendees,
    getOnlyOrgRecords,
    deleteRecord,
    getEventAttendanceAnalysis
};

async function addRecordn(record, user) {
    record.createdBy = user;

    const rec = new Attendance(record);

    rec._id = null;
    await rec.save();
    return user;
}

async function getRecords(eventId) {
    let recordArr = [];

    if (Array.isArray(eventId)) {
        for (let i = 0; i < eventId.length; i++) {
            recordArr.push(await Attendance.find({ event: eventId[i] }).populate({
                path: 'eventref',
                populate: {
                    path: 'hostref'
                },
                select: '-hash -key'
            }).
                populate({
                    path: 'userorgref hostref userref',
                    select: '-hash -key'
                }));
        }
    } else {
        recordArr.push(await Attendance.find({ event: eventId }).populate({
            path: 'eventref',
            populate: {
                path: 'hostref'
            },
            select: '-hash -key'
        }).populate({
            path: 'userorgref hostref userref',
            select: '-hash -key'
        }));
    }


    return recordArr;

}

async function getOnlyOrgRecords(orgid) {
    let recordArr = [];
    let records = await Attendance.find({ userorgref: orgid }).populate({
        path: 'eventref',
        populate: {
            path: 'hostref'
        },
        select: '-hash -key'
    }).populate({
        path: 'userorgref userref hostref',
        select: '-hash -key'
    }).sort([['date', -1]]);

    for (let i = 0; i < records.length; i++) {
        let record = records[i];
        let data = {};
        data.Date = record.date;
        data.Event = record.eventref.eventName;
        data.Host = record.eventref.hostref.organization;
        data.FirstName = record.userref.firstname;
        data.LastName = record.userref.lastname;
        data.OrgStatus = record.approvedByOrg;
        data.EventStatus = record.approvedByEvent;
        data.UserName = record.userref.username;
        data.Proof = record.proof;
        data.groupsubmission = record.isgroupsubmission ? 'Group' : 'Individual';
        data.qrscanned = record.qrcodescanned ? 'Yes' : 'No';
        recordArr.push(data);
    }
    return recordArr;
}

async function getOrgRecords(orgid) {

    let returnArr = [];
    let recordArr = [];





    recordArr.push(await Attendance.find({ userorgref: orgid }).populate({ path: 'eventref hostref userref userorgref', select: '-hash -key' }).sort([['eventref', -1]]));

    let events = await Attendance.find({ hostref: orgid }).distinct('eventref');


    let eventArr = [];
    if (Array.isArray(events)) {
        for (let i = 0; i < events.length; i++) {
            const query = await Event.find({ _id: events[i] }).populate({ path: 'eventref hostref userref userorgref', select: '-hash -key' });

            if (query.length != 0) {
                eventArr.push(query);
            }
        }
    }
    console.log(recordArr);
    console.log(eventArr);
    returnArr.push(recordArr);
    returnArr.push(eventArr);

    return returnArr;

}

async function getUserRecords(user) {
    let data = await Attendance.find({ userref: user }).populate({
        path: 'eventref',
        populate: {
            path: 'hostref campusref'
        }
    }).populate({
        path: 'userorgref userref'
    }).sort([['date', -1]]);

    let records = [];
    for (let i = 0; i < data.length; i++) {
        let recPoint = {};
        let record = data[i];
        recPoint.Date = record.date;

        recPoint.Event = record.eventref.eventName;
        recPoint.Campus = record.eventref.campusref.name;
        recPoint.Host = record.eventref.hostref.organization;
        recPoint.Proof = record.proof;
        recPoint.approvedByEvent = record.approvedByEvent;
        recPoint.approvedByOrg = record.approvedByOrg;
        recPoint.id = record._id;
        recPoint.groupsubmission = record.isgroupsubmission ? 'Group' : 'Individual';
        recPoint.qrscanned = record.qrcodescanned ? 'Yes' : 'No';
        records.push(recPoint);
    }
    return records;
}

async function setUserAttendanceStatus(recordId, value, countBoth, field) {
    const rec = await Attendance.findOne({ _id: recordId });

    if (countBoth === 'true') {
        rec.approvedByEvent = value;
        rec.approvedByOrg = value;

    }
    else if (field === 'approvedByEvent') {
        rec.approvedByEvent = value;

    } else if (field === 'approvedByOrg') {
        rec.approvedByOrg = value;
    }
    return rec.save();

}

async function getSignedS3Url(filename, type) {
    const accessKeyId = process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_KEY_LOC;
    AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: 'us-east-1'
    })

    const s3 = new AWS.S3();
    if (type === 'putObject') {
        const params = {
            Bucket: 'panthropia',
            Fields: {
                key: filename
            },
            Expires: 3600
        }
        const url = s3.createPresignedPost(params);
        console.log(url)
        return url;
    }
    else if (type === 'getObject') {
        const params = {
            Bucket: 'panthropia',
            Key: filename,
            Expires: 3600
        }
        const url = s3.getSignedUrl('getObject', params);

        return url;
    }
}

async function getNonAttendees(eventid, orgid) {

    let attendees = await Attendance.find({ eventref: eventid, userorgref: orgid }).select("userref");

    let orgUsers = await User.find({ orgref: orgid, role: { '$ne': 'Admin' } }).populate({ path: 'orgref', select: 'organization' }).select('username firstname lastname orgref');

    let nonAttendees = [];
    for (let i = 0; i < orgUsers.length; i++) {



        if (!attendees.some(attendee => attendee.userref.toString() === orgUsers[i]._id.toString())) {

            nonAttendees.push(orgUsers[i]);
        }
    }
    let excuses = await Excuses.aggregate([
        {
            $match:
            {
                eventref: new mongoose.Types.ObjectId(eventid)
            }
        },
        {
            $lookup: {
                from: User.collection.name,
                localField: "userref",
                foreignField: "_id",
                as: "userobj"
            }
        },
        {
            $match: {
                "userobj.orgref": new mongoose.Types.ObjectId(orgid)
            }
        }
    ])

    let nonAttendeesExcuses = [];


    console.log(nonAttendees)
    for (let i = 0; i < nonAttendees.length; i++) {

        let isAccepted = excuses.some((excuse) => excuse.userref.toString() === nonAttendees[i]._id.toString() && excuse.approval === "Accepted");

        if (isAccepted) {
            nonAttendees[i].organization = "Yes";


        }
        else {

            Object.assign(nonAttendees[i], { organization: "No" })


        }
    }



    return nonAttendees;
}

async function deleteRecord(id) {
    return await Attendance.deleteOne({ _id: id });
}

async function getEventAttendanceAnalysis(id) {

    let atOrgCount = await Attendance.aggregate([
        {
            $match: {
                eventref: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $group:
            {
                _id: "$userorgref",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        }

    ])
    let atOrgRejectedCount = await Attendance.aggregate([
        {
            $match: {
                eventref: new mongoose.Types.ObjectId(id),
                approvedByEvent: "Rejected"
            }
        },
        {
            $group: {
                _id: "$userorgref",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        }

    ])
    let atOrgPendingCount = await Attendance.aggregate([
        {
            $match: {
                eventref: new mongoose.Types.ObjectId(id),
                approvedByEvent: "Pending"
            }
        },
        {
            $group: {
                _id: "$userorgref",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        }

    ])

    let atOrgAcceptedCount = await Attendance.aggregate([
        {
            $match: {
                eventref: new mongoose.Types.ObjectId(id),
                approvedByEvent: "Accepted"
            }
        },
        {
            $group: {
                _id: "$userorgref",
                count: { $sum: 1 }
            }
        },

        {
            $sort: {
                '_id': 1
            }
        }

    ])

    let atOrgMembersAttended = await Attendance.aggregate([
        {
            $match: {
                eventref: new mongoose.Types.ObjectId(id),
                approvedByEvent: { $ne: 'Rejected' }
            }
        },
        {
            $group: {
                _id: "$userorgref",
                uniqueValues: { $addToSet: "$userref" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        }

    ])
    console.log(atOrgMembersAttended)
    let orgUserCount = [];
    for (let i = 0; i < atOrgCount.length; i++) {
        let members = await User.find({ orgref: atOrgCount[i]._id, role: { $ne: "Admin" } }).countDocuments();
        let orgdata = await Organization.findOne({ _id: atOrgCount[i]._id }).populate("campusref").select("organization name");
        let data = {
            organization: orgdata.organization,
            attendancecount: atOrgCount[i] ? atOrgCount[i].count : 0,
            acceptedsubmissions: atOrgAcceptedCount[i] ? atOrgAcceptedCount[i].count : 0,
            pendingsubmissions: atOrgPendingCount[i] ? atOrgPendingCount[i].count : 0,
            rejectedsubmissions: atOrgRejectedCount[i] ? atOrgRejectedCount[i].count : 0,
            members: atOrgMembersAttended[i] ? atOrgMembersAttended[i].uniqueValues.length : 0,
            totalmembers: members,
            percentage: 100 * ((atOrgMembersAttended[i] ? atOrgMembersAttended[i].uniqueValues.length : 0) / members),
            campus: orgdata.campusref.name
        }
        orgUserCount.push(data)


    }

    return orgUserCount;

}


