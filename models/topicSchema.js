const mongoose = require('mongoose');const Schema = mongoose.Schema;const topicSchema = new Schema({    topicOwnerInfo: {        type: Object,        require: true    },    topicOwner: {        type: String,        require: true    },    title: {        type: String,        require: true    },    description: {        type: String,        require: true    },    photos: {        type: Array,        require: true    },    uploadedTopic: {        type: Number,        require: true    },    posts: {        type: Array,        require: true    },    lastPostInfo: {        lastPostTime: {            type: Number,            require: true        },        lastPostUser: {            type: String,            require: true        }    }})module.exports = mongoose.model('Final-exam-topics', topicSchema)