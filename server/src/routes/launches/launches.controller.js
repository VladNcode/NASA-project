const { getAllLaunches, addNewLaunch, cancelLaunch } = require('../../models/launches.model');

const httpGetAllLaunches = function (req, res) {
  // for (value of launches.values()) {
  //   console.log(value);
  // }
  res.status(200).json(getAllLaunches());
  // res.status(200).json(Object.fromEntries(launches)[100]);
};

const httpAddNewLaunch = function (req, res) {
  const { mission, rocket, launchDate, target } = req.body;

  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({ error: 'Missing launch property!' });
  }

  const date = new Date(launchDate);

  // if (date.toString() === 'Invalid Date') {
  //   return res.status(400).json({ error: 'Invalid launchDate!' });
  // }

  if (isNaN(date)) {
    return res.status(400).json({ error: 'Invalid launchDate!' });
  }

  const launch = {
    mission,
    rocket,
    launchDate: date,
    target,
  };

  addNewLaunch(launch);

  res.status(201).json({
    status: 'success',
    launch,
  });
};

const httpCancelLaunch = (req, res) => {
  if (!cancelLaunch(req.params.id)) {
    return res.status(404).json({ error: 'ID not found!' });
  }

  res.status(200).json(cancelLaunch(req.params.id));
};

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpCancelLaunch };
