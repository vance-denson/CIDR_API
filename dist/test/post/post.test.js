"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const app_1 = require("../../app");
app_1.startServer;
const endpoint = process.env.TEST_PATH || 'localhost:3000/api/cidr';
describe('-- POST / PATH --', () => {
    describe('HappyPath', function () {
        it('posting 10.1.1.1/30 is successful', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/30' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.body.success, 'true');
                done();
            })
                .catch((err) => done(err));
        });
        it('block size created is correct', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/30' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.body.data[0], 'Created: 2 IPs in block 10.1.1.1/30');
                done();
            })
                .catch((err) => done(err));
        });
        it('starting IP is correct', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/30' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.body.data[1], 'Starting IP: 10.1.1.1(255.255.255.252)');
                done();
            })
                .catch((err) => done(err));
        });
        it('ending IP is correct', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/30' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.body.data[2], 'Ending IP: 10.1.1.2(255.255.255.252)');
                done();
            })
                .catch((err) => done(err));
        });
        it('host mask is correct', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/30' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.body.data[3], 'Hostmask: 0.0.0.3');
                done();
            })
                .catch((err) => done(err));
        });
        it('all status set to available', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/30' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.status, '200'),
                    (0, chai_1.assert)(rsp.body.data[4], 'All status: available');
                done();
            })
                .catch((err) => done(err));
        });
        it('blocksize of 10.1.1.1/32 is 1', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/32' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.status, '200'),
                    (0, chai_1.assert)(rsp.body.data[0], 'Created: 1 IPs in block 10.1.1.1/32');
                done();
            })
                .catch((err) => done(err));
        });
        it('blocksize of 10.1.1.1/24 is 254', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/24' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.status, '200'),
                    (0, chai_1.assert)(rsp.body.data[0], 'Created: 255 IPs in block 10.1.1.1/24');
                done();
            })
                .catch((err) => done(err));
        });
    });
    describe('Not So HappyPath', function () {
        it('posting 10.1.1.1/33 FAIL, block size out of bounds', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/33' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.status, '500');
                done();
            })
                .catch((err) => done(err));
        });
        it('posting 10.1.1.1/33 success is FALSE', (done) => {
            (0, supertest_1.default)(endpoint)
                .post('/')
                .send({ address: '10.1.1.1/33' })
                .set('Accept', 'application/json')
                .then((rsp) => {
                (0, chai_1.assert)(rsp.body.success == false);
                (0, chai_1.assert)(rsp.status, '500');
                done();
            })
                .catch((err) => done(err));
        });
    });
});
