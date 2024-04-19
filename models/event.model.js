const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    eventName: { type: String, required: true },
    charity: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    enddate: { type: Date, default: Date.now, required: true },
    dateTime: { type: Date, default: Date.now, required: true },
    endDateTime: { type: Date, required: true },
    starttime: { type: String, required: true },
    endtime: { type: String, required: true },
    multipledayevent: { type: Boolean, default: false, required: true },
    info: { type: String },
    flyer: { type: String },
    createdBy: { type: String, required: true },
    uniqueDate: { type: Boolean, default: true },
    privateEvent: { type: Boolean, default: false, required: true },
    privateOrganizations: { type: Array, default: [], required: true },
    archived: { type: Boolean, default: false, required: true },
    eventType: { type: String, required: true },
    isDeleted: { type: String, required: true, default: false },
    hostref: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    campusref: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
    privateorgsref: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
    hasLocation: { type: Boolean, default: false, required: true },
    location: { type: String, required: false },
    qrcode: { type: String, required: false },
    qrcoderequired: { type: Boolean, required: true, default: false },
    proofrequired: { type: Boolean, required: true, default: false },
    groupsubmissionallowed: { type: Boolean, required: true, default: true },
    previousqr: { type: String, required: false },
    acceptexcuses: { type: Boolean, default: true, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', schema);

