const Launch = require('./launches.mongo');
// const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Exlporer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);

const getAllLaunches = async function () {
  return await Launch.find({});
  // return Array.from(launches.values());
};

const addNewLaunch = function (launch) {
  latestFlightNumber++;
  // launches.set(
  //   latestFlightNumber,
  //   Object.assign(launch, {
  //     flightNumber: latestFlightNumber,
  //     customers: ['ZTM', 'NASA'],
  //     upcoming: true,
  //     success: true,
  //   })
  // );
};

const cancelLaunch = function (id) {
  // return launches.delete(+id);

  // const aborted = launches.get(+id);

  if (aborted === undefined) {
    return false;
  }

  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
};

module.exports = { getAllLaunches, addNewLaunch, cancelLaunch };
