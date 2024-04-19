const db = require('../_helpers/database');
const Campus = db.Campus;
const Organization = db.Organization;
const Event = db.Event;
const AtRecord = db.Attendance;
const User = db.User;


module.exports = {
    addCampus,
    getCampuses,
    getOneCampus,
    patchCampus
};

async function addCampus(body) {
    const rec = new Campus(body);
    await rec.save();
    return rec;
}

async function getCampuses() {
    return Campus.find({});
}

async function getOneCampus(name) {

    return Campus.findOne({ name: name });
}

async function patchCampus(id, body) {
    const campus = await Campus.findOne({ _id: id });
    const oldName = campus.name;

    for (let key in body) {
        campus[key] = body[key];
        if (key === 'name') {
            await Organization.updateMany({ campus: oldName }, { $set: { campus: body[key] } });
            await Event.updateMany({ campus: oldName }, { $set: { campus: body[key] } });
            await AtRecord.updateMany({ campus: oldName }, { $set: { campus: body[key] } });
            await User.updateMany({ campus: oldName }, { $set: { campus: body[key] } });
        }
    }




    console.log(await campus.save());
    return campus;
}
