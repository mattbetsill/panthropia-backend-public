const { User } = require('../_helpers/database');
const db = require('../_helpers/database');
const Event = db.Event;



module.exports = {
    getAllEvents,
    addEvent,
    getOneEvent,
    deleteEvent,
    getEventCreatedby,
    editEvent,
    getPrivOrgNames,
    getQr,
    removeQr,
    verifyQr
}



async function getAllEvents(campusId, userid, isOrg, isProfile, date) {
    console.log(date)
    const current = new Date(date);
    if (campusId === '000000000000') {
        // console.log("I hope this doesn't print");
        return [];
    }

    if ((userid.toString() === '000000000000')) {
        console.log("this should print\n\n\n\n");

        let eventArr = await Event.find({ campusref: campusId, isDeleted: { $ne: true }, privateEvent: false, archived: false }).populate({ path: 'hostref campusref', select: "-key -hash" }).sort({ dateTime: 1 });


        eventArr = eventArr.filter(event => {


            return new Date(event.date) >= current;
        });
        return eventArr;

    }

    // if ((userid.toString() === '000000000000') && (isOrg === 'false')) {

    //     let eventArr = await Event.find({ campusref: campusId, isDeleted: { $ne: true }, privateEvent: false, archived: false }).populate({ path: 'hostref campusref', select: "-key -hash" }).sort({ dateTime: 1 });


    //     eventArr = eventArr.filter(event => {


    //         return new Date(event.date) >= current;
    //     });
    //     return eventArr;

    // }
    let user = await User.findOne({ _id: userid }).populate('orgref');


    if (user && user.role === 'Admin' && user.orgref && isOrg !== 'false' && isProfile === 'true') {
        console.log("admin")
        return await Event.find({ campusref: campusId, isDeleted: { $ne: true }, hostref: user.orgref._id, archived: true }).populate({ path: 'hostref campusref', select: "-key -hash" }).sort({ dateTime: 1 });
    }



    let events = await Event.find({ campusref: campusId, isDeleted: { $ne: true } }).populate({ path: 'hostref campusref', select: "-key -hash" }).sort({ dateTime: 1 });

    if (isOrg === 'false') {
        events = events.filter(event => {
            const orgs = event.privateorgsref;

            return new Date(event.date) >= current && (!event.privateEvent || (user && user.orgref && orgs.includes(user.orgref._id ? user.orgref._id : '000000000000'))) && event.archived === false;
        });
    }
    else {
        events = events.filter(event => {
            const orgs = event.privateorgsref;

            return (!event.privateEvent || (user && user.orgref && orgs.includes(user.orgref._id ? user.orgref._id : '000000000000'))) && event.archived === false;
        });
    }


    if (isOrg !== 'false' && (isProfile === 'false')) {


        events = events.filter(event => {
            const orgs = event.privateorgsref;

            return isOrg.toString() === event.hostref._id.toString() && (!event.privateEvent || (user && user.orgref && orgs.includes(user.orgref._id ? user.orgref._id.toString() : '000000000000'))) && event.archived === false;
        });
        // tslint:disable-next-line:prefer-for-of

    }








    return events;
}


async function getEventCreatedby(createdBy) {

    return await Event.find({ createdBy: createdBy, isDeleted: { $ne: true } }).populate({ path: 'hostref', select: "-key -hash" }).select('-key -hash');

}
async function getOneEvent(eventParams) {

    console.log(eventParams)
    return await Event.findOne({ _id: eventParams, isDeleted: { $ne: true } }).populate({ path: 'hostref privateorgsref campusref', select: "-key -hash" }).select('-key -hash');

}

async function addEvent(event, username) {
    let newevent = event;
    let simDate = await Event.find({ campus: event.campus, date: event.date }).sort({ dateTime: 1 })

    if (simDate.length > 0) {
        console.log(new Date(event.dateTime) < new Date(simDate[0].dateTime))
        if (new Date(event.dateTime) < new Date(simDate[0].dateTime)) {
            newevent.uniqueDate = true;
            console.log(await Event.updateOne({ _id: simDate[0]._id }, { $set: { uniqueDate: false } }));

        } else {
            newevent.uniqueDate = false;
        }

    }
    else if (!username) {
        throw 'Error with the user submitting the request. User information missing. Malformed request.';
    }


    console.log(newevent)
    const dbevent = new Event(newevent);
    dbevent.createdBy = username;

    // save the record
    await dbevent.save();

    return username;

}

async function deleteEvent(eventParams) {
    return await Event.updateOne({ _id: eventParams }, { $set: { isDeleted: true } });



}

async function editEvent(id, event) {

    let editedEvent = await Event.findOne({ _id: id });
    for (let key in event) {
        editedEvent[key] = event[key];
    }
    return editedEvent.save();


}

async function getPrivOrgNames(eventId) {
    let event = await Event.findOne({ _id: eventId }).populate({ path: 'privateorgsref', select: 'organization' });
    let orgArray = [];
    for (let i = 0; i < event.privateorgsref.length; i++) {

        orgArray.push({ organization: event.privateorgsref[i].organization, id: event.privateorgsref[i]._id });
    }
    return orgArray;
}


async function getQr(eventId, user) {
    let event = await Event.findOne({ _id: eventId, createdBy: user }).populate({ path: 'hostref' });

    return event;
}

async function removeQr(eventId, user) {
    let event = await Event.findOne({ _id: eventId, createdBy: user });
    event.qrcode = null;
    return true && event.save();
}

async function verifyQr(eventId, code) {
    let event = await Event.findOne({ _id: eventId });
    if (event.qrcode === code || event.previousqr === code) {
        return true;
    }
    else {
        return false;
    }
}