const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch, httpCancelLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.route('/').get(httpGetAllLaunches).post(httpAddNewLaunch);
launchesRouter.delete('/:id', httpCancelLaunch);

module.exports = launchesRouter;
