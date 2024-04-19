const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String, required: true },
    campus: { type: String, required: false },
    role: { type: String, required: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    proof: { type: String, required: false },
    event: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: String, required: true },
    approvedByOrg: { type: String, required: true },
    approvedByEvent: { type: String, required: true },
    eventname: { type: String, required: true },
    hostorg: { type: String, required: true },
    hostcampus: { type: String, required: true },
    hostref: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    hostcampusref: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
    campusref: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
    userref: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventref: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userorgref: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    isgroupsubmission: { type: Boolean, required: false, default: false },
    qrcodescanned: { type: Boolean, required: true, default: false },
    hasproofimage: { type: Boolean, required: true, default: false },

}
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AtRecord', schema);
