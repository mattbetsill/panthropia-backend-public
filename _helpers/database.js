const mongoose = require('mongoose');
mongoose.connect((process.env.MONGODB_URI ?
    process.env.MONGODB_URI :
    process.env.MONGODB_URI_DEV), { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection error:', err));

module.exports = {

    User: require('../models/user.model'),
    Event: require('../models/event.model'),
    Organization: require('../models/organization.model'),
    Attendance: require('../models/atrecord.model'),
    Campus: require('../models/campus.model'),
    Excuses: require('../models/excuses.model')
};
