

const { Excuses, User, Organization, Event, Campus } = require('../_helpers/database');
const { ObjectId } = require('mongodb');

var mongoose = require("mongoose");

module.exports = {
    addExcuse,
    getUserExcuses,
    getOrgExcuses,
    deleteExcuse,
    editExcuse,
    getEventExcuses
}

async function addExcuse(userId, excuse) {
    excuse.createdBy = userId;

    const rec = new Excuses(excuse);



    return rec.save();
}

async function getUserExcuses(userId) {
    let excuses = await Excuses.find({ userref: userId }).populate({
        path: 'eventref',
        populate: { path: 'hostref' },
        select: '-hash -key -qrcode'
    })
        .populate({
            path: 'userref campusref',
            select: '-hash -key -qrcode'
        })
        .sort('createddatetime');
    let newExcuses = [];
    for (let i = 0; i < excuses.length; i++) {
        let current = excuses[i];
        let newEx = {};
        newEx.Date = current.createddatetime;
        newEx.Event = current.eventref.eventName;
        newEx.Host = current.eventref.hostref.organization;
        newEx.Note = current.info;
        newEx.Approval = current.approval;
        newEx.id = current._id;
        newExcuses.push(newEx);
    }
    return newExcuses;
}

async function getOrgExcuses(orgId) {
    let orgexcuses = await Excuses.aggregate([
        {
            $lookup: {
                from: User.collection.name,
                localField: "userref",
                foreignField: "_id",
                as: "userobj"
            }
        },
        {

            $lookup: {
                from: Organization.collection.name,
                localField: "userobj.orgref",
                foreignField: "_id",
                as: 'userorgobj'
            }

        },
        {
            $unwind: "$userorgobj"


        },
        {
            $match: {
                'userorgobj._id': new mongoose.Types.ObjectId(orgId)
            }
        },
        {
            $lookup: {
                from: Organization.collection.name,
                localField: "hostref",
                foreignField: "_id",
                as: 'hostorgobj'
            }
        },
        {
            $lookup: {
                from: Event.collection.name,
                localField: "eventref",
                foreignField: "_id",
                as: 'eventobj'
            }
        },


        {
            $unwind: "$userobj"
        },
        {
            $unwind: "$hostorgobj"
        },
        {
            $unwind: "$eventobj"
        },

        {
            $project: {
                approval: 1,
                info: 1,
                host: "$hostorgobj.organization",
                date: "$createddatetime",
                firstname: "$userobj.firstname",
                lastname: "$userobj.lastname",
                id: "$_id",
                event: "$eventobj.eventName"





            }
        }





    ]);

    return orgexcuses;
}

async function deleteExcuse(id) {
    return Excuses.deleteOne({ _id: id });
}

async function editExcuse(edits) {
    let excuse = await Excuses.findOne({ _id: new mongoose.Types.ObjectId(edits.id) });
    for (key in edits) {
        excuse[key] = edits[key]
    }
    return excuse.save();
}

async function getEventExcuses(id, orgid) {
    let excuses = await Excuses.aggregate([
        {
            $lookup: {
                from: Event.collection.name,
                localField: 'eventref',
                foreignField: '_id',
                as: 'eventobj'
            }
        },

        {
            $match: {
                "eventobj._id": new mongoose.Types.ObjectId(id)

            }
        }, {
            $lookup: {
                from: User.collection.name,
                localField: "userref",
                foreignField: "_id",
                as: "userobj"
            }
        },
        {

            $lookup: {
                from: Organization.collection.name,
                localField: "userobj.orgref",
                foreignField: "_id",
                as: 'userorgobj'
            }

        },
        {
            $match: {
                'userorgobj._id': new mongoose.Types.ObjectId(orgid)
            }
        },

        {
            $lookup: {
                from: Organization.collection.name,
                localField: "hostref",
                foreignField: "_id",
                as: 'hostorgobj'
            }
        },
        {
            $unwind: "$userobj"
        },
        {
            $unwind: "$hostorgobj"
        },
        {
            $unwind: "$eventobj"
        },

        {
            $project: {
                approval: 1,
                info: 1,
                host: "$hostorgobj.organization",
                date: "$createddatetime",
                firstname: "$userobj.firstname",
                lastname: "$userobj.lastname",
                id: "$_id",
                event: "$eventobj.eventName"





            }
        }




    ]);

    return excuses;
}