const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/database');
const User = db.User;
const Organization = db.Organization;


const mailgun = require("mailgun-js");

const { Attendance } = require('../_helpers/database');



module.exports = {
    authenticate,
    getAllUsers,
    getByUsername,
    addUser,
    editUser,
    editUserOrg,
    getOrgMembers,
    setIndependent,
    recoverUsernameEmail,
    resetPasswordEmail,
    resetPassword,
    editUsersEmail,
    editUsersUsername
}

async function authenticate({ username, password }) {

    const user = await User.findOne({ username }).populate('campusref orgref').select('-key');
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.SECRET);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAllUsers() {
    //Returning the result of the promise.
    return await User.find().populate('orgref campusref').select('-hash');
}






async function getByUsername(username) {

    return await User.find({ username: username });
}

async function resetPassword(password, code) {
    if (!code) {
        return false;
    }
    if (code.length < 5) {
        return false;
    }
    let user = await User.findOne({ passwordreset: code });
    if (!user) {
        return false;
    }
    if (password) {

        user.hash = bcrypt.hashSync(password, 10);
        await user.save()
        return true;
    }
    return false;

}

async function addUser(userParam) {

    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    else if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }
    if (userParam.role !== 'Admin') {
        let prospectiveOrg = await Organization.findOne({ _id: userParam.orgref });
        if (prospectiveOrg.isprivate && prospectiveOrg.key !== userParam.passkey) {
            throw 'Organization Passcode Incorrect!';
        }
    }


    const user = new User(userParam);
    console.log(user)
    console.log("here")



    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.DOMAIN })
    if (user.role === 'Admin') {
        const data = {
            from: "Panthropia <no-reply@panthropia.com>",
            to: userParam.email,
            subject: "Thanks for registering your organization.",
            template: "orgregister",
            'h:X-Mailgun-Variables': JSON.stringify({ "name": user.organization })
        };
        mg.messages().send(data, function (error, body) {
            console.log(body);
        });
    }
    else {
        const data = {
            from: "Panthropia <no-reply@panthropia.com>",
            to: userParam.email,
            subject: "Hello",
            template: "userregister",
            'h:X-Mailgun-Variables': JSON.stringify({ "name": user.firstname })
        };
        mg.messages().send(data, function (error, body) {
            console.log(body);
        });
    }

    // save user
    await user.save();

}

async function editUser(edits, user) {
    let oldUser = await User.findOne({ _id: user });
    for (let key in edits) {
        oldUser[key] = edits[key];

    }
    return oldUser.save();


}

async function editUserOrg(edits, user, orgref) {
    let oldUser = await User.findOne({ _id: user }).populate('orgref');



    for (let key in edits) {
        oldUser.key = edits[key];
    }

    let modify = await Organization.findOne({ _id: orgref });
    console.log(modify)
    modify.organization = edits['organization'];
    modify.key = edits.key;
    modify.isprivate = edits.isprivate;
    console.log(await modify.save());


    return oldUser.save();


}

async function getOrgMembers(orgref) {
    return User.find({ orgref: orgref, role: { $ne: "Admin" } }).select('firstname lastname username');
}

async function setIndependent(userref) {
    let user = await User.findOne({ _id: userref });
    console.log(user)
    user.orgref = process.env.INDEPENDENT_ID;
    user.organization = 'Independent';
    let orgRecords = await Attendance.find({ userref: userref });
    if (orgRecords) {
        for (let i = 0; i < orgRecords.length; i++) {
            orgRecords[i].userorgref = process.env.INDEPENDENT_ID;
            await orgRecords[i].save();
        }
    }
    console.log(user)
    return user.save();

}

async function recoverUsernameEmail(email) {
    let user = await User.findOne({ email: email });
    if (!user) {
        return false;
    }

    const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.DOMAIN })

    const data = {
        from: "Panthropia <no-reply@panthropia.com>",
        to: email,
        subject: "Username Recovery",
        template: "recoverusername",
        'h:X-Mailgun-Variables': JSON.stringify({ "username": user.username })
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });


    return true;



}

async function editUsersEmail() {
    let users = await User.find();
    for (let i = 0; i < users.length; i++) {
        users[i].email = users[i].email.toString().toLowerCase();
        await users[i].save();
    }
    return true;
}

async function editUsersUsername() {
    let users = await User.find();
    for (let i = 0; i < users.length; i++) {
        users[i].username = users[i].username.toString().toLowerCase();
        await users[i].save();
    }
    return true;
}



async function resetPasswordEmail(email) {
    let user = await User.findOne({ email: email });
    if (!user) {
        return false;
    }

    let rand = 10000000000 * Math.random();
    rand = rand.toString();
    rand = rand.replace('.', '');
    console.log(rand)
    user.passwordreset = rand;
    await user.save();
    setTimeout(() => {
        user.passwordreset = null
        user.save();
    }, 15 * 1000000);

    let link = process.env.NODE_ENV === 'production' ? 'panthropia.com/resetpassword?code=' + rand : 'http://localhost:4200/resetpassword?code=' + rand;
    console.log(link)
    const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.DOMAIN })

    const data = {
        from: "Panthropia <no-reply@panthropia.com>",
        to: email,
        subject: "Password Reset Link",
        template: "passwordrecover",
        'h:X-Mailgun-Variables': JSON.stringify({ "url": link })
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
    return true;
}



