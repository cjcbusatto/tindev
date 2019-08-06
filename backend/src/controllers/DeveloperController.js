const axios = require('axios');
const Developer = require('../models/Developer');

module.exports = {
    async index(req, res) {
        const developerId = req.headers.user;
        const loggedDev = await Developer.findById(developerId);
        const users = await Developer.find({
            $and: [
                { _id: { $ne: developerId } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },
            ],
        });
        if (!users)
            return res.status(404).json({ error: 'No developers found' });

        return res.status(200).json(users);
    },
    async store(req, res) {
        const { username: user } = req.body;

        const userExists = await Developer.findOne({ user });
        if (userExists) return res.json(userExists);

        const response = await axios.get(
            `https://api.github.com/users/${user}`
        );
        const { name, bio, avatar_url: avatar } = response.data;

        await Developer.create({
            name,
            user,
            bio,
            avatar,
        });

        return res.json({ ok: true });
    },
};
