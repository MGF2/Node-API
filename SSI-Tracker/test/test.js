process.env.NODE_ENV = 'testing';

const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require("../server1.js")
const should = chai.should();

chai.use(chaiHttp);

describe('/POST login' , () => {
    it('should create a user token with permissions in redis db', (done) => {
        chai.request(app)
        .post('/login')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.token.should.not.be.empty;
        done();
        });
    });
});


describe('/GET all trackings', () => {
    it('should get all record from db trackings', (done) => {
        chai.request(app)
        .get('/tracking')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNjEzMDQ3MTM3fQ.EAAxdL6gTJ2MyFoqV_GT0i3c8ZuYM94cnyCq6oz7TFY')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
    });
});


describe('/POST Create a new track', () => {
    it('should create new operation in the db', (done) => {
        let tracking = {
            amount : 25,
            issuer : "4ce1e015-6619-4035-b211-14908a9cb9a9",
            description : "test",
            beneficiary : "4ce1e015-6619-4035-b211-14908a9cb9a9",
            ethereum_id : "4ce1e015-6619-4035-b211-14908a9cb9a9"
        }
        chai.request(app)
        .post('/trackingw')
        .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNjEzMDQ3MTM3fQ.EAAxdL6gTJ2MyFoqV_GT0i3c8ZuYM94cnyCq6oz7TFY')
        .send( tracking )
        .end((err, res) => {
             res.should.have.status(200);
        done();
        });
    });
});