const Launch = require('./launches.mongo');

let latestFlightNumber = 100;

const getAllLaunches = async function () {
  return await Launch.find({});
};

const addNewLaunch = async function (launch) {
  const lastLaunch = await Launch.findOne().sort('-flightNumber');
  if (!lastLaunch) {
    launch.flightNumber = 100;
  } else {
    launch.flightNumber = ++lastLaunch.flightNumber;
  }

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
