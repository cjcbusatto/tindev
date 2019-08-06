const Developer = require('../models/Developer');
module.exports = {
    async store(req, res) {
        const developerId = req.headers.user;
        const developerLikedId = req.params.id;

        const loggedDeveloper = await Developer.findById(developerId);
        const likedDeveloper = await Developer.findById(developerLikedId);

        if (!likedDeveloper) {
            return res
                .status(400)
                .json({ error: 'Liked developer does not exist' });
        }

        if (likedDeveloper.likes.includes(loggedDeveloper._id)) {
            console.log('Match!');
        }

        loggedDeveloper.likes.push(likedDeveloper._id);
        await loggedDeveloper.save();

        return res.json(loggedDeveloper);
    },
};
