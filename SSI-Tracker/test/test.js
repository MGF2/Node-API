process.env.NODE_ENV = 'testing';

const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require("../server1.js")
const should = chai.should();

chai.use(chaiHttp);

//WORKFLOW TEST
describe('/POST login', () => {
    it('should create a user token with permissions in redis db', (done) => {
        let user = {
            id: 5
        }
        chai.request(app)
            .post('/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.token.should.not.be.empty;
                done();

                describe('/GET all trackings', () => {
                    it('should get all record from db trackings', (done) => {
                        chai.request(app)
                            .get('/tracking')
                            .set("Authorization", "Bearer " + res.body.token)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.should.be.json;
                                done();
                            });
                    });
                    it('should NOT get all record from db trackings-User DOES NOT HAVE PEMISSION TO READ', (done) => {
                        chai.request(app)
                            .get('/tracking')
                            // no R permission eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFtb3VudCI6IjQxIiwiaXNzdWVyIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5IiwiZGVzY3JpcHRpb24iOiJwb3N0bWFuIG9rb2sgcmVmYWN0b3JpbmciLCJiZW5lZmljaWFyeSI6IjRjZTFlMDE1LTY2MTktNDAzNS1iMjExLTE0OTA4YTljYjlhOSIsImV0aGVyZXVtX2lkIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5In0sImlhdCI6MTYxMzY1OTY2Nn0.KpiNMQo4VLAvEem7No0xBwIOtp2IJdjtEEzvUVwuqnI
                            .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFtb3VudCI6IjQxIiwiaXNzdWVyIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5IiwiZGVzY3JpcHRpb24iOiJwb3N0bWFuIG9rb2sgcmVmYWN0b3JpbmciLCJiZW5lZmljaWFyeSI6IjRjZTFlMDE1LTY2MTktNDAzNS1iMjExLTE0OTA4YTljYjlhOSIsImV0aGVyZXVtX2lkIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5In0sImlhdCI6MTYxMzY1OTY2Nn0.KpiNMQo4VLAvEem7No0xBwIOtp2IJdjtEEzvUVwuqnI')
                            .end((err, res) => {
                                res.should.have.status(403);
                                done();
                            });
                    });
                });
                describe('/POST Create a new track', () => {
                    it('should create new operation in the db', (done) => {
                        let tracking = {
                            amount: 2,
                            issuer: "4ce1e015-6619-4035-b211-14908a9cb9a9",
                            description: "workflow-test",
                            beneficiary: "4ce1e015-6619-4035-b211-14908a9cb9a9",
                            ethereum_id: "4ce1e015-6619-4035-b211-14908a9cb9a9"
                        }

                        chai.request(app)
                            .post('/trackingw')
                            .set("Authorization", "Bearer " + res.body.token)
                            .send(tracking)
                            .end((err, res) => {
                                res.should.have.status(200);
                                done();
                            });
                    });
                    it('should NOT create new operation in the db- data not acceptable', (done) => {
                        let trackingNope = {
                            amount: '',
                            issuer: "4ce1e015-6619-4035-b211-14908a9cb9a9",
                            description: "workflow-test",
                            beneficiary: "4ce1e015-6619-4035-b211-14908a9cb9a9",
                            ethereum_id: "4ce1e015-6619-4035-b211-14908a9cb9a9"
                        }

                        let trackingNope2 = {
                            amount: 56,
                            issuer: "4ce1e015-6619-4035-b211-14908a9cb9a9",
                            description: "workflow-test",
                            ethereum_id: "4ce1e015-6619-4035-b211-14908a9cb9a9"
                        }
                            chai.request(app)
                            .post('/trackingw')
                            .set("Authorization", "Bearer " + res.body.token)
                            .send(trackingNope)
                            .end((err, res) => {
                                res.should.have.status(406);
                            });
                            chai.request(app)
                            .post('/trackingw')
                            .set("Authorization", "Bearer " + res.body.token)
                            .send(trackingNope2)
                            .end((err, res) => {
                                res.should.have.status(406);
                                done()
                            });
                    });
                    it('should NOT create new operation in the db- User DOES NOT HAVE PEMISSION TO POST', (done) => {
                        let tracking = {
                            amount: 2,
                            issuer: "4ce1e015-6619-4035-b211-14908a9cb9a9",
                            description: "NO PERMISSION-workflow-test",
                            beneficiary: "4ce1e015-6619-4035-b211-14908a9cb9a9",
                            ethereum_id: "4ce1e015-6619-4035-b211-14908a9cb9a9"
                        }
                            chai.request(app)
                            .post('/trackingw')
                            // no w permissions eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFtb3VudCI6IjQxIiwiaXNzdWVyIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5IiwiZGVzY3JpcHRpb24iOiJwb3N0bWFuIG9rb2sgcmVmYWN0b3JpbmciLCJiZW5lZmljaWFyeSI6IjRjZTFlMDE1LTY2MTktNDAzNS1iMjExLTE0OTA4YTljYjlhOSIsImV0aGVyZXVtX2lkIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5In0sImlhdCI6MTYxMzY1ODYyN30.ATSPo5IpacWSKYOCBB-RWddqDjEvpU4LjJ9EJh5oreE
                            .set("Authorization", "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFtb3VudCI6IjQxIiwiaXNzdWVyIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5IiwiZGVzY3JpcHRpb24iOiJwb3N0bWFuIG9rb2sgcmVmYWN0b3JpbmciLCJiZW5lZmljaWFyeSI6IjRjZTFlMDE1LTY2MTktNDAzNS1iMjExLTE0OTA4YTljYjlhOSIsImV0aGVyZXVtX2lkIjoiNGNlMWUwMTUtNjYxOS00MDM1LWIyMTEtMTQ5MDhhOWNiOWE5In0sImlhdCI6MTYxMzY1ODYyN30.ATSPo5IpacWSKYOCBB-RWddqDjEvpU4LjJ9EJh5oreE")
                            .send(tracking)
                            .end((err, res) => {
                                res.should.have.status(403);
                                done();
                            });
                    });
                });
            });
    });
});

//HAPPY PATH
/* describe('/POST login', () => {
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
            amount: 25,
            issuer: "4ce1e015-6619-4035-b211-14908a9cb9a9",
            description: "test",
            beneficiary: "4ce1e015-6619-4035-b211-14908a9cb9a9",
            ethereum_id: "4ce1e015-6619-4035-b211-14908a9cb9a9"
        }
        chai.request(app)
            .post('/trackingw')
            .set("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNjEzMDQ3MTM3fQ.EAAxdL6gTJ2MyFoqV_GT0i3c8ZuYM94cnyCq6oz7TFY')
            .send(tracking)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
}); */
