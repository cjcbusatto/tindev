const { Schema, model } = require('mongoose');
const DeveloperSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            default: '',
        },
        avatar: {
            type: String,
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Developer',
            },
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Developer',
            },
        ],
    },
    { timestamps: true }
);

module.exports = model('Developer', DeveloperSchema);
