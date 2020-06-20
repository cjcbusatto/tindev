const Developer = require('../../models/Developer');
const assert = require('chai').assert;
const expect = require('chai').expect;

describe('Developer constructor', () => {
    it('should create an object as described in the Developer model', async () => {
        const developer = new Developer({
            name: 'name',
            user: 'user',
            bio: 'bio',
            avatar: 'avatar',
            likes: [],
            dislikes: [],
        });

        expect(developer).to.include({
            name: 'name',
            user: 'user',
            bio: 'bio',
            avatar: 'avatar',
        });
    });
});
