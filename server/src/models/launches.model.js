const Launch = require('./launches.mongo');

const getAllLaunches = async function () {
  try {
    return await Launch.find({});
  } catch (e) {
    console.error(e);
  }
};

const addNewLaunch = async function (launch) {
  try {
    const lastLaunch = await Launch.findOne().sort('-flightNumber');
    if (!lastLaunch) {
      launch.flightNumber = 100;
    } else {
      launch.flightNumber = ++lastLaunch.flightNumber;
    }

    await Launch.create(launch);
  } catch (e) {
    console.error(e);
  }
};

const cancelLaunch = async function (id) {
  try {
    const launch = await Launch.findOneAndUpdate(
      { flightNumber: +id },
      {
        upcoming: false,
        success: false,
      }
    );

    return launch;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getAllLaunches, addNewLaunch, cancelLaunch };
