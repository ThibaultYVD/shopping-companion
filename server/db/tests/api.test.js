const request = require('supertest');
const app = require('../index');

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'DB Server' });
  });
});

describe('GET /user/groups', () => {
  it('should return 200 and groups list in json', async () => {
    const res = await request(app).get('/user/groups');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch('application/json');
  });
});