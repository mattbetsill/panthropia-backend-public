
const expressJwt = require('express-jwt');
const userService = require('../services/user.service');

module.exports = jwt;

//expressJwt(...) returns a function that takes three paramaters req, res and next. Thus, this will register as middleware.
function jwt() {
    const secret = process.env.SECRET;
    return new expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/',
            '/.*',
            '/user/register',
            '/user/authenticate',
            '/user/allusers',
            '/event/getCampusEvents',
            '/event/getSingleEvent',
            '/organizations/getAllOrgs',
            '/organizations/getOrgByName',
            '/organizations/getFeaturedOrg',
            '/attendance/s3PutUrl',
            '/attendance/s3GetUrl',
            '/campus/getCampuses',
            '/campus/addCampus',
            '/campus/getOneCampus',
            '/campus/patchCampus',
            '/organizations/patchOrgName',
            '/user/resetUsernameEmail',
            '/user/resetPasswordEmail',
            '/user/resetPassword',
            '/user/recoverUsernameEmail'


        ]
    });
}


async function isRevoked(req, payload, done) {

    const user = await userService.getByUsername(payload.sub);
    if (!user) {

        return done(null, true);
    }

    done();
};
