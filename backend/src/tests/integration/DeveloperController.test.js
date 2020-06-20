const Developer = require('../../models/Developer');
const request = require('supertest');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const { Types } = require('mongoose');
let server;
chai.use(require('chai-shallow-deep-equal'));

describe('Developer routes', () => {
    beforeEach(() => {
        server = require('../../server');
    });

    afterEach(async () => {
        server.close();
        await Developer.deleteMany();
    });

    // Useful function to write async tests with mocha chai
    const mochaAsync = (fn) => {
        return (done) => {
            fn.call().then(done, (err) => {
                done(err);
            });
        };
    };

    describe('GET /developers/', () => {
        it(
            'should return 500 if header "user" is invalid',
            mochaAsync(async () => {
                const invalidUserHeader = '1';
                const res = await request(server)
                    .get('/developers/')
                    .set('user', invalidUserHeader);

                // Throw HTTP 500
                expect(res.status).to.equal(500);
                // and should include an error message to help user
                expect(res.body).to.have.key('error');
            })
        );
        it(
            'should return 404 if developer account is not found',
            mochaAsync(async () => {
                const validUserHeader = Types.ObjectId();
                const res = await request(server)
                    .get('/developers/')
                    .set('user', validUserHeader);

                expect(res.status).to.equal(404);
            })
        );
        it(
            'should return an empty list of developers if there are no developers stored',
            mochaAsync(async () => {
                // The developer making the request
                const developer = new Developer({
                    name: 'name',
                    user: 'user',
                    bio: 'bio',
                    avatar: 'avatar',
                });
                await developer.save();

                const res = await request(server)
                    .get('/developers/')
                    .set('user', developer._id);

                // we expect an HTTP Code 200 containing a list of developers
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.an('array').that.is.empty;
            })
        );
        it(
            'should return the list of developers if there are developers stored',
            mochaAsync(async () => {
                // The developer making the request
                const developer = new Developer({
                    name: 'name',
                    user: 'user',
                    bio: 'bio',
                    avatar: 'avatar',
                });
                await developer.save();

                // Include a developer on the database, otherwise the array is empty
                const developerListItemConfig = {
                    name: 'name-item',
                    user: 'user-item',
                    bio: 'bio-item',
                    avatar: 'avatar-item',
                };
                const developerListItem = new Developer(developerListItemConfig);
                await developerListItem.save();

                const res = await request(server)
                    .get('/developers/')
                    .set('user', developer._id);

                // HTTP 200
                expect(res.status).to.equal(200);
                // Containing a list of developers
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.shallowDeepEqual(developerListItemConfig);
            })
        );
    });

    describe('POST /developers/', () => {
        it(
            'should insert a new developer if github account exists',
            mochaAsync(async () => {
                const developer = {
                    username: 'cjcbusatto',
                };
                const res = await request(server)
                    .post('/developers/')
                    .send(developer);

                expect(res.status).to.equal(200);
                // Containing a list of developers
                expect(res.body).to.be.an('object');
                expect(res.body).to.shallowDeepEqual({ ok: true });
            })
        );

        it(
            'should throw a 404 if github account does not exist',
            mochaAsync(async () => {
                const developer = {
                    username: '128937h12893h182931areallylongnamethatprobablygithubdoesnotallowtobeanuser',
                };
                const res = await request(server)
                    .post('/developers/')
                    .send(developer);

                expect(res.status).to.equal(404);
                // Containing a list of developers
                expect(res.body).to.be.an('object');
                expect(res.body).to.shallowDeepEqual({ message: 'Github user not found' });
            })
        );
        it(
            'should return the same developer if the entry is a duplicate',
            mochaAsync(async () => {
                const developer = {
                    username: 'cjcbusatto',
                };
                let res = await request(server)
                    .post('/developers/')
                    .send(developer);

                expect(res.status).to.equal(200);
                // Containing a list of developers
                expect(res.body).to.be.an('object');
                expect(res.body).to.shallowDeepEqual({ ok: true });

                res = await request(server)
                    .post('/developers/')
                    .send(developer);

                expect(res.status).to.equal(200);
                // Containing a list of developers
                expect(res.body).to.be.an('object');
                expect(res.body).to.shallowDeepEqual({ user: 'cjcbusatto' });
            })
        );
    });
    // const developer1 = new Developer({
    //     name: 'name1',
    //     user: 'user1',
    //     bio: 'bio1',
    //     avatar: 'avatar1',
    // // });
    // // await developer1.save();

    // await developer2.save();
    //         await developer1.remove();
    //         await developer2.remove();
    // const developer2 = new Developer({
    //     name: 'name2',
    //     user: 'user2',
    //     bio: 'bio2',
    //     avatar: 'avatar2',
    // });
    // });
    // describe('GET /beacons/uuid/1/1', () => {
    //     it('should return an existent beacon', async () => {
    //         const beacon1 = new Beacon({
    //             uuid: 'uuid',
    //             major: 1,
    //             minor: 1,
    //             timestamp: 1,
    //             rssi: 1,
    //         });
    //         await beacon1.save();

    //         const res = await request(server).get('/api/beacons/uuid/1/1');
    //         expect(res.status).toBe(200);

    //         expect(res.body.uuid).toBe('uuid');
    //         expect(res.body.major).toBe(1);
    //         expect(res.body.minor).toBe(1);
    //         expect(res.body.timestamp).toBe(1);
    //         expect(res.body.rssi).toBe(1);

    //         await beacon1.remove();
    //     });
    // });
    // describe('GET /beacons/uuid/1/2', () => {
    //     it('should return a not found beacon', async () => {
    //         const res = await request(server).get('/beacons/uuid/1/2');
    //         expect(res.status).toBe(404);
    //     });
    // });
});
