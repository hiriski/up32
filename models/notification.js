const mongoose = require('mongoose')

const NotificationModel = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
        type: String,
        enum: [
            'common',
            'reminder',
            'friends_follow',
            'leaderboard',
            'heart_refill',
        ],
        default: 'common',
    },
    dataId: { type: String, default: null },
    readAt: { type: Date, default: null },
})

module.exports = mongoose.model('Notification', NotificationModel)