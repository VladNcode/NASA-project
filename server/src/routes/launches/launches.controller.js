const {
  getAllLaunches,
  addNewLaunch,
  cancelLaunch,
  findOneLaunch,
} = require('../../models/launches.model');

const httpGetAllLaunches = async function (req, res) {
  res.status(200).json(await getAllLaunches());
};

const httpAddNewLaunch = async function (req, res) {
  const { mission, rocket, launchDate, target } = req.body;

  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({ error: 'Missing launch property!' });
  }

  const date = new Date(launchDate);

  if (isNaN(date)) {
    return res.status(400).json({ error: 'Invalid launchDate!' });
  }

  const launch = {
    mission,
    rocket,
    launchDate: date,
    target,
  };

  const createLaunch = await addNewLaunch(launch);

  if (!createLaunch) {
    return res.status(400).json({ error: 'Invalid target!' });
  }

  // remove _id and __v from response
  const findLaunch = await findOneLaunch(createLaunch.flightNumber);

  res.status(201).json({
    status: 'success',
    launch: findLaunch,
  });
};

const httpCancelLaunch = async (req, res) => {
  const cancel = await cancelLaunch(req.params.id);

  if (!cancel) {
    return res.status(404).json({ error: 'ID not found!' });
  }

  res.status(200).json(cancel);
};

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpCancelLaunch };
