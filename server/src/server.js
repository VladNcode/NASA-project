require('dotenv').config({ path: './src/config.env' });
const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const server = require('http').createServer(app);

const port = process.env.PORT || 4000;

const init = async () => {
  await loadPlanetsData();

  server.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
  });
};

init();
