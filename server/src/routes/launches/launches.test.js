const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const res = await request(app).get('/launches').expect(200);
    expect(res.body[0].flightNumber).toBe(100);
  });
});

describe('Test POST /launches', () => {
  const launchDataWithoutDate = {
    mission: 'ZTM155',
    rocket: 'ZTM Experimental IS1',
    target: 'Kepler-186f',
  };

  test('It should respond with 201 created', async () => {
    const res = await request(app)
      .post('/launches')
      .send(Object.assign(launchDataWithoutDate, { launchDate: 'January 30, 2030' }))
      .expect(201);

    // expect(res.body.launch).toEqual(
    //   expect.objectContaining(Object.assign(launchDataWithoutDate, { launchDate: '2030-01-29T22:00:00.000Z' }))
    // );

    const date = new Date('January 30, 2030').valueOf();
    const resDate = new Date(res.body.launch.launchDate).valueOf();

    expect(res.body.launch).toMatchObject(
      Object.assign(launchDataWithoutDate, { launchDate: '2030-01-29T22:00:00.000Z' })
    );

    expect(date).toEqual(resDate);
    expect(res.body.launch.flightNumber).toBe(101);
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
