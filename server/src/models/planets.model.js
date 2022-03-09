const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = [];

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', data => {
        if (
          data.koi_disposition === 'CONFIRMED' &&
          data.koi_insol > 0.36 &&
          data.koi_insol < 1.11 &&
          data.koi_prad < 1.6
        ) {
          planets.push(data);
        }
      })
      .on('error', err => {
        reject(err);
        console.log(err);
      })
      .on('end', () => {
        console.log(`Found ${planets.length} habitable planets!`);
        resolve();
      });
  });
};

const getAllPlanets = function () {
  return planets;
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
