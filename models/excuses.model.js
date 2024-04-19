const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schema = new Schema({
    approval: { type: String, required: true, default: 'Pending' },
    info: { type: String, required: true },
    hostref: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },

    campusref: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
    userref: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventref: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    createddatetime: { type: Date, required: true },
    isgroupsubmission: { type: Boolean, required: true, default: false },
    createdBy: { type: String, required: true }

}
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Excuse', schema);