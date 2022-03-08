const { launches } = require('../../models/launches.model');

const getAllLaunches = function (req, res, next) {
  // for (value of launches.values()) {
  //   console.log(value);
  // }
  res.status(200).json(Array.from(launches.values()));
  // res.status(200).json(Object.fromEntries(launches)[100]);
};

module.exports = { getAllLaunches };
