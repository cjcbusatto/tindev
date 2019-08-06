const Developer = require('../models/Developer');
module.exports = {
    async store(req, res) {
        const developerId = req.headers.user;
        const dislikedDeveloperId = req.params.id;

        const loggedDeveloper = await Developer.findById(developerId);
        const dislikedDeveloper = await Developer.findById(dislikedDeveloperId);

        if (!dislikedDeveloper) {
            return res
                .status(400)
                .json({ error: 'Liked developer does not exist' });
        }

        if (dislikedDeveloper.likes.includes(loggedDeveloper._id)) {
            console.log('Match!');
        }

        loggedDeveloper.dislikes.push(dislikedDeveloper._id);
        await loggedDeveloper.save();

        return res.json(loggedDeveloper);
    },
};
