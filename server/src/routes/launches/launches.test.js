require('dotenv').config({ path: './test.env' });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connection.once('open', () => console.log('Mongoose connection established'));
mongoose.connection.on('error', err => console.error(err));

beforeAll(async () => {
  await mongoose.connect(DB);
  await mongoose.connection.db.dropDatabase();
  await loadPlanetsData();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Test POST /launches', () => {
  const launchDataWithoutDate = {
    mission: 'ZTM155',
    rocket: 'ZTM Experimental IS1',
    target: 'Kepler-296 f',
  };

  test('It should respond with 201 created', async () => {
    const res = await request(app)
      .post('/launches')
      .send(Object.assign(launchDataWithoutDate, { launchDate: 'January 30, 2030' }))
      .expect(201);

    // expect(res.body.launch[0]).toEqual(
    //   expect.objectContaining(
    //     Object.assign(launchDataWithoutDate, { launchDate: '2030-01-29T22:00:00.000Z' })
    //   )
    // );

    const date = new Date('January 30, 2030').valueOf();
    const resDate = new Date(res.body.launch[0].launchDate).valueOf();

    expect(res.body.launch[0]).toMatchObject(
      Object.assign(launchDataWithoutDate, { launchDate: '2030-01-29T22:00:00.000Z' })
    );

    expect(date).toEqual(resDate);
    expect(res.body.launch[0].flightNumber).toBe(100);
  });

  test('It should catch error with missing props', async () => {
    const res = await request(app)
      .post('/launches')
      .send(Object.assign(launchDataWithoutDate, { launchDate: null }))
      .expect(400);

    expect(res.body.error).toBe('Missing launch property!');
  });

  test('It should catch error with invalid dates', async () => {
    const res = await request(app)
      .post('/launches')
      .send(Object.assign(launchDataWithoutDate, { launchDate: 'Hello' }))
      .expect(400);

    expect(res.body.error).toBe('Invalid launchDate!');
  });
});

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const res = await request(app).get('/launches').expect(200);

    expect(res.body[0].flightNumber).toBe(100);
  });
});

describe('Test GET /planets', () => {
  test('Counting planets', async () => {
    const res = await request(app).get('/planets').expect(200);
    expect(res.body.length).toBe(8);
  });
});
