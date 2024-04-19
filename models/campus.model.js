const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schema = new Schema({
    name: { type: String, required: true, unique: true },
    subName: { type: String },
    location: { type: String }
}
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Campus', schema);
