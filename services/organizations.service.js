var mongoose = require("mongoose");
const db = require("../_helpers/database");
const { Organization } = require("../_helpers/database");
const Organizations = db.Organization;
const Events = db.Event;
const AtRecords = db.Attendance;
const User = db.User;

module.exports = {
  getAllOrgs,
  getFeaturedOrg,
  addOrg,
  getOrgByName,
  editOrg,
  patchOrgName,
};

async function getAllOrgs(campusId) {
  if (campusId === "000000000000") {
    return [];
  }

  return await Organizations.find(
    { campusref: campusId, organization: { $ne: "Independent" } },
    "organization isprivate _id",
  );
}

async function getFeaturedOrg(campusId) {
  const eventList = await Events.find({ campusref: campusId });
  let featuredOrg = null;
  if (campusId === "000000000000") {
    return featuredOrg;
  }

  if (eventList.length > 0) {
    featuredOrg = await Events.aggregate([
      {
        $match: {
          campusref: new mongoose.Types.ObjectId(campusId),
        },
      },
      {
        $group: {
          _id: "$hostref",
          totalEvents: { $sum: 1 },
        },
      },
    ]);
  } else {
    return await Organizations.findOne({
      campusref: campusId,
      _id: { $ne: "6121cacad2fa956e04154965" },
    }).select("-key");
  }

  if (
    await Organizations.findOne({
      _id: featuredOrg[0]._id,
      campusref: campusId,
      _id: { $ne: "6121cacad2fa956e04154965" },
    })
  ) {
    let firstEvent = await Events.find({
      campusref: campusId,
      date: { $gte: new Date() },
    }).sort("date");
    if (!firstEvent[0]) {
      return await Organizations.findOne({
        campusref: campusId,
        _id: { $ne: "6121cacad2fa956e04154965" },
      }).select("-key");
    }
    let selected = firstEvent[0].hostref;

    return await Organizations.findOne({
      campusref: campusId,
      _id: selected,
      _id: { $ne: "6121cacad2fa956e04154965" },
    }).select("-key");
  } else {
    return await Organizations.findOne({
      campusref: campusId,
      _id: { $ne: "6121cacad2fa956e04154965" },
    }).select("-key");
  }
}
async function getOrgByName(id) {
  if (id === "000000000000") {
    return;
  }

  return await Organizations.findOne({ _id: id }).populate({
    path: "campusref userref",
    select: "-hash -key",
  });
}
async function addOrg(org, username) {
  console.log(username);
  const alreadyMade = await Organizations.findOne({ createdBy: username });
  console.log(alreadyMade);
  org.createdBy = username;
  if (alreadyMade) {
    await Organizations.findOneAndReplace({ createdBy: username }, org);
    return org;
  }

  let newOrg = org;

  const dbOrg = new Organization(newOrg);
  dbOrg.createdBy = username;

  await dbOrg.save();

  return dbOrg;
}

async function editOrg(organization, username) {
  const alreadyMade = await Organization.findOne({ createdBy: username });
  console.log(username);
  organization.createdBy = username;

  if (alreadyMade) {
    return await Organization.findOneAndUpdate(
      { createdBy: username },
      organization,
    );
  }
  const dbOrg = new Organization(organization);

  return dbOrg.save();
}

async function patchOrgName(campus, id, newName) {
  const org = await Organization.findOne({ _id: id, campus: campus });

  if (org && org._id) {
    console.log(
      await Events.updateMany(
        { campus: campus, host: org.organization },
        { $set: { host: newName } },
      ),
    );
    let privateEvents = await Events.find({
      campus: campus,
      privateEvent: true,
    });
    console.log(privateEvents);
    for (let i = 0; i < privateEvents.length; i++) {
      let privateOrgs = privateEvents[i].privateOrganizations;
      if (privateOrgs.includes(org.organization)) {
        let index = privateOrgs.indexOf(org.organization);
        privateOrgs.splice(index, 1);
        privateOrgs.push(newName);
        privateEvents[i].privateOrganizations = privateOrgs;
        console.log(privateEvents[i].save());
        break;
      }
    }
    await User.updateMany(
      { campus: campus, organization: org.organization },
      { $set: { organization: newName } },
    );
    await AtRecords.updateMany(
      { campus: campus, organization: org.organization },
      { $set: { organization: newName } },
    );
    await AtRecords.updateMany(
      { hostcampus: campus, hostorg: org.organization },
      { $set: { hostorg: newName } },
    );
    org.organization = newName;
    return org.save();
  }
  return "Something went wrong: no organization found";
}
