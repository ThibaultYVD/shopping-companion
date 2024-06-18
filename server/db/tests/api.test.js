const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken') ;
const app = require('../index');

describe('GET /', () => {
  it('should return a welcome message', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'DB Server');
        done();
      });
  });
});


const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
};

describe('GET /user/groups', () => {
  it('should return 200 and groups with a valid token', async () => {
    const token = generateToken({ id: 30, username: 'admin', roles:['admin'] });
    request(app)
      .get('/user/groups')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res)=>{
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('groups').that.is.an('array');
      })
    
  });
});