const Launch = require('./launches.mongo');

let latestFlightNumber = 100;

const getAllLaunches = async function () {
  return await Launch.find({});
};

const addNewLaunch = async function (launch) {
  launch.flightNumber = latestFlightNumber++;
  await Launch.create(launch);
};

const cancelLaunch = async function (id) {
  const launch = await Launch.findOneAndUpdate(
    { flightNumber: +id },
    {
      upcoming: false,
      success: false,
    }
  );

  return launch;
};

module.exports = { getAllLaunches, addNewLaunch, cancelLaunch };
