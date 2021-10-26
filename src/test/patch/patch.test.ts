import { startServer } from '../../app';
import ChaiHttp from 'chai-http';
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
chai.use(chaiHttp);

startServer;
const endpoint: string = process.env.TEST_PATH || 'localhost:3000/api/cidr';

describe('-- PATCH TESTS --', () => {
  describe('Route /', () => {
    describe('Setup', () => {
      it('test db created', (done) => {
        chai
          .request(endpoint)
          .post('/')
          .send({ address: '10.1.1.1/30' })
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(201);
            done();
          });
      });
    });
    describe('Test', () => {
      it('Change IP 1 from available to acquired', (done) => {
        chai
          .request(endpoint)
          .patch('/')
          .send({ address: '10.1.1.1', status: 'acquired' })
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(200);
            res.body.should.have.property('success', true);
            res.body.should.have.property('status', 'acquired');
            done();
          });
      });
      it('Delete first IP - status 404, success FALSE', (done) => {
        chai
          .request(endpoint)
          .delete('/')
          .send({ address: '10.1.1.1' })
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(200);
            res.body.should.have.property('success', true);
            done();
          });
      });
      it('Delete Second IP - status 200, success TRUE', (done) => {
        chai
          .request(endpoint)
          .delete('/')
          .send({ address: '10.1.1.2' })
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(200);
            res.body.should.have.property('success', true);
            done();
          });
      });
    });
  });
  describe('Route /:IP', () => {
    describe('Setup', () => {
      it('test db created', (done) => {
        chai
          .request(endpoint)
          .post('/')
          .send({ address: '10.1.1.1/30' })
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(201);
            done();
          });
      });
    });
    describe('Test', () => {
      it('Delete first IP - status 200, success TRUE', (done) => {
        chai
          .request(endpoint)
          .delete('/10.1.1.1')
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(200);
            res.body.should.have.property('success', true);
            done();
          });
      });
      it('Delete first IP - status 404, success FALSE', (done) => {
        chai
          .request(endpoint)
          .delete('/10.1.1.1')
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(404);
            res.body.should.have.property('success', false);
            done();
          });
      });
      it('Delete Second IP - status 200, success TRUE', (done) => {
        chai
          .request(endpoint)
          .delete('/10.1.1.2')
          .end((err: Error, res: ChaiHttp.Response) => {
            res.should.have.status(200);
            res.body.should.have.property('success', true);
            done();
          });
      });
    });
  });
});
