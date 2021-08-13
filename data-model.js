const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReplySchema = new Schema({
    text: {type: String, required: true},
    created_on: {type: Date},
    reported: {type: Boolean, default: false},
    delete_password: {type: String, required: true}
});

const Reply = mongoose.model("Reply", ReplySchema);

const ThreadSchema = new Schema({
    board: {type: String},
    text: {type: String, required: true},
    created_on: {type: Date},
    bumped_on: {type: Date},
    reported: {type: Boolean, default: false},
    replies: {type: [ReplySchema], default: []},
    delete_password: {type: String, required: true}
});

const Thread = mongoose.model("Thread", ThreadSchema);

exports.Reply = Reply;
exports.Thread = Thread;