"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../app");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
app_1.startServer;
const endpoint = process.env.TEST_PATH || 'localhost:3000/api/cidr';
describe('-- GET / PATH --', () => {
    describe('HappyPath', () => {
        describe('Setup', () => {
            it('test db created', (done) => {
                chai
                    .request(endpoint)
                    .post('/')
                    .send({ address: '10.1.1.1/30' })
                    .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
            });
        });
        describe('Test', () => {
            it('fetch all IPs', (done) => {
                chai
                    .request(endpoint)
                    .get('/')
                    .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            });
            it('correct number of IPs fetched', (done) => {
                chai
                    .request(endpoint)
                    .get('/')
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('addresses').lengthOf(2);
                    done();
                });
            });
        });
    });
    describe('Not So HappyPath', () => {
        describe('Setup', () => {
            it('Delete 1 of 2 elements', (done) => {
                chai
                    .request(endpoint)
                    .delete('/10.1.1.1')
                    .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            });
            it('Delete 2 of 2 elements', (done) => {
                chai
                    .request(endpoint)
                    .delete('/10.1.1.2')
                    .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            });
        });
        describe('Test', () => {
            it('404 if fetching empty DB', (done) => {
                chai
                    .request(endpoint)
                    .get('/')
                    .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('Empty DB fetch: Success = false', (done) => {
                chai
                    .request(endpoint)
                    .get('/')
                    .end((err, res) => {
                    res.body.should.have.property('success', false);
                    done();
                });
            });
            it('No addresses found message provided', (done) => {
                chai
                    .request(endpoint)
                    .get('/')
                    .end((err, res) => {
                    res.body.should.have.property('msg', 'No addresses found');
                    done();
                });
            });
        });
    });
});
