const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Planet = require('./planets.mongo');

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async data => {
        if (
          data.koi_disposition === 'CONFIRMED' &&
          data.koi_insol > 0.36 &&
          data.koi_insol < 1.11 &&
          data.koi_prad < 1.6
        ) {
          await savePlanet(data);
        }
      })
      .on('error', err => {
        reject(err);
        console.log(err);
      })
      .on('end', async () => {
        console.log(`Found ${(await getAllPlanets()).length} habitable planets!`);

        resolve();
      });
  });
};

const getAllPlanets = async function () {
  try {
    return await Planet.find();
  } catch (e) {
    console.error(e);
  }
};

const savePlanet = async function (planet) {
  try {
    await Planet.findOneAndUpdate(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
