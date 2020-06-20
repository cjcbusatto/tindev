const axios = require('axios');
const { Types } = require('mongoose');
const Developer = require('../models/Developer');

module.exports = {
    async index(req, res) {
        const developerId = req.headers.user;
        if (!Types.ObjectId.isValid(developerId))
            return res.status(500).json({ error: 'user must be a valid ObjectId' });

        const loggedDev = await Developer.findById(developerId);
        if (!loggedDev) {
            return res.status(404).json({ error: 'Developer account not found' });
        }
        const users = await Developer.find({
            $and: [
                { _id: { $ne: developerId } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },
            ],
        });

        return res.status(200).json(users);
    },
    async store(req, res) {
        const { username: user } = req.body;
        const userExists = await Developer.findOne({ user });
        if (userExists) return res.json(userExists);

        try {
            const response = await axios.get(`https://api.github.com/users/${user}`);
            const { name, bio, avatar_url: avatar } = response.data;

            await Developer.create({
                name,
                user,
                bio,
                avatar,
            });

            return res.json({ ok: true });
        } catch (error) {
            return res.status(404).json({ message: 'Github user not found' });
        }
    },
};
