const { TooManyRequests } = require('http-errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    role: { type: String, required: true },
    organization: { type: String, required: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    orgref: { type: Schema.Types.ObjectId, ref: 'Organization' },
    campusref: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
    passwordreset: { type: String, required: false }
}
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
