const Launch = require('./launches.mongo');
const Planet = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const incrementFlightNumber = async () => {
  const lastLaunch = await Launch.findOne().sort('-flightNumber');
  if (!lastLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return ++lastLaunch.flightNumber;
};

const findOneLaunch = async flightNumber => {
  try {
    return await Launch.find({ flightNumber }).select(['-__v', '-_id']);
  } catch (e) {
    console.error(e);
  }
};

const getAllLaunches = async function () {
  try {
    return await Launch.find().select(['-__v', '-_id']);
  } catch (e) {
    console.error(e);
  }
};

const addNewLaunch = async function (launch) {
  try {
    const targetPlanet = await Planet.findOne({ keplerName: launch.target });
    if (!targetPlanet) {
      throw new Error('No matching planet found!');
    }

    launch.flightNumber = await incrementFlightNumber();

    return await Launch.create(launch);
  } catch (e) {
    console.error(e);
  }
};

const cancelLaunch = async function (id) {
  try {
    const launch = await Launch.findOneAndUpdate(
      { flightNumber: id },
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

module.exports = { getAllLaunches, addNewLaunch, cancelLaunch, findOneLaunch };
