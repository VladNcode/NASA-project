require('dotenv').config({ path: './src/config.env' });
const app = require('./app');
const server = require('http').createServer(app);

const port = process.env.PORT || 4000;

server.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
