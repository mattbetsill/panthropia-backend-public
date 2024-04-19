const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const schema = new Schema({
    organization: { type: String, required: true },
    createdBy: { type: String, required: true },
    charity: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String },
    isprivate: { type: Boolean, default: false },
    key: { type: String, required: false },
    campusref: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
    userref: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    primarycolor: { type: String, required: true, default: '#53B79F' }
}
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Organization', schema);
