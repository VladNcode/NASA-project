const axios = require('axios');
const Launch = require('./launches.mongo');
const Planet = require('./planets.mongo');
const APIFeatures = require('../services/query');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const options = {
  select: ['rocket', 'payloads', 'flight_number', 'name', 'date_local', 'upcoming', 'success'],
  pagination: false,
  populate: [
    {
      path: 'rocket',
      select: { name: 1 },
    },
    {
      path: 'payloads',
      select: { customers: 1 },
    },
  ],
};

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

const getAllLaunches = async function (qr) {
  try {
    const features = new APIFeatures(Launch.find({}), qr).filter().sort().limitFields().paginate();

    return await features.query;
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

const fetchSpacexData = async function () {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options,
  });

  if (response.status !== 200) {
    console.log('Problem downloading spacex data!');
    throw new Error('Problem downloading spacex data!');
  }

  const { docs } = response.data;

  for (let i = 0; i < docs.length; i++) {
    await Launch.findOneAndUpdate(
      {
        flightNumber: docs[i].flight_number,
      },
      {
        flightNumber: docs[i].flight_number,
        mission: docs[i].name,
        launchDate: docs[i].date_local,
        // target: 'Kepler-296 f',
        rocket: docs[i].rocket.name,
        customers: docs[i].payloads.flatMap(c => c.customers),
        upcoming: docs[i].upcoming,
        success: docs[i].success,
      },
      { upsert: true }
    );
  }
};

const firstLaunch = async function () {
  return await Launch.findOne({
    flight_number: 1,
    rocket: 'Falcon 1',
    name: 'FalconSat',
  });
};

const loadLaunchData = async function () {
  try {
    console.log('Fetching launch data...');

    const alreadyFetched = await firstLaunch();

    if (!alreadyFetched) {
      console.log('Fetching data!');
      await fetchSpacexData();
    } else {
      console.log('Data already fetched!');
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getAllLaunches, addNewLaunch, cancelLaunch, findOneLaunch, loadLaunchData };
