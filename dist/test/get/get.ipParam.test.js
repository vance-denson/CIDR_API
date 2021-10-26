"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../app");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
app_1.startServer;
const endpoint = process.env.TEST_PATH || 'localhost:3000/api/cidr';
describe('-- GET /:IP PATH --', () => {
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
            it('http status 200', (done) => {
                chai
                    .request(endpoint)
                    .get('/10.1.1.1')
                    .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            });
            it('Success:true', (done) => {
                chai
                    .request(endpoint)
                    .get('/10.1.1.1')
                    .end((err, res) => {
                    res.body.should.have.property('success', true);
                    done();
                });
            });
            it('Correct msg returned', (done) => {
                chai
                    .request(endpoint)
                    .get('/10.1.1.1')
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('msg', 'Status of 10.1.1.1: available');
                    done();
                });
            });
            it('Success:true returned', (done) => {
                chai
                    .request(endpoint)
                    .get('/10.1.1.1')
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').lengthOf(1);
                    done();
                });
            });
        });
    });
    describe('Not So HappyPath', () => {
        describe('Test', () => {
            it('404 if fetching IP that does not exist', (done) => {
                chai
                    .request(endpoint)
                    .get('/9.9.9.9')
                    .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('Correct msg when fetching non-existent IP', (done) => {
                chai
                    .request(endpoint)
                    .get('/9.9.9.9')
                    .end((err, res) => {
                    res.body.should.have.property('msg', 'No existing IP address at 9.9.9.9');
                    done();
                });
            });
            it('Success: false returned', (done) => {
                chai
                    .request(endpoint)
                    .get('/9.9.9.9')
                    .end((err, res) => {
                    res.body.should.have.property('success', false);
                    done();
                });
            });
        });
    });
});
