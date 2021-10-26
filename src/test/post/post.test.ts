import request, { Response } from 'supertest';
import { assert } from 'chai';
import { startServer } from '../../app';

startServer;
const endpoint: string = process.env.TEST_PATH || 'localhost:3000/api/cidr';

describe('-- POST / PATH --', () => {
  describe('HappyPath', function () {
    it('posting 10.1.1.1/30 is successful', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/30' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.body.success, 'true');
          done();
        })
        .catch((err) => done(err));
    });
    it('block size created is correct', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/30' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.body.data[0], 'Created: 2 IPs in block 10.1.1.1/30');
          done();
        })
        .catch((err) => done(err));
    });
    it('starting IP is correct', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/30' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.body.data[1], 'Starting IP: 10.1.1.1(255.255.255.252)');
          done();
        })
        .catch((err) => done(err));
    });
    it('ending IP is correct', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/30' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.body.data[2], 'Ending IP: 10.1.1.2(255.255.255.252)');
          done();
        })
        .catch((err) => done(err));
    });
    it('host mask is correct', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/30' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.body.data[3], 'Hostmask: 0.0.0.3');
          done();
        })
        .catch((err) => done(err));
    });
    it('all status set to available', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/30' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.status, '200'),
            assert(rsp.body.data[4], 'All status: available');
          done();
        })
        .catch((err) => done(err));
    });
    it('blocksize of 10.1.1.1/32 is 1', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/32' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.status, '200'),
            assert(rsp.body.data[0], 'Created: 1 IPs in block 10.1.1.1/32');
          done();
        })
        .catch((err) => done(err));
    });
    it('blocksize of 10.1.1.1/24 is 254', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/24' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.status, '200'),
            assert(rsp.body.data[0], 'Created: 255 IPs in block 10.1.1.1/24');
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('Not So HappyPath', function () {
    it('posting 10.1.1.1/33 FAIL, block size out of bounds', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/33' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.status, '500');
          done();
        })
        .catch((err) => done(err));
    });
    it('posting 10.1.1.1/33 success is FALSE', (done) => {
      request(endpoint)
        .post('/')
        .send({ address: '10.1.1.1/33' })
        .set('Accept', 'application/json')
        .then((rsp: Response) => {
          assert(rsp.body.success == false);
          assert(rsp.status, '500');
          done();
        })
        .catch((err) => done(err));
    });
  });
});
