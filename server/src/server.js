require('dotenv').config({ path: './src/config.env' });
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const server = require('http').createServer(app);
const port = process.env.PORT || 4000;

mongoose.connection.once('open', () => console.log('Mongoose connection established'));
mongoose.connection.on('error', err => console.error(err));

const init = async () => {
  mongoose.connect(DB);

  await loadPlanetsData();
  await loadLaunchData();

  server.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
  });
};

init();
