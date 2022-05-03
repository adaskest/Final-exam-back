const userDB = require('../models/userSchema')const topicDB = require('../models/topicSchema')async function updateTopic(id) {    const topicData = await topicDB.findOne({_id: id.toString()})    const user = await userDB.findOne({username: topicData.topicOwner})    const topicOwnerUpdate = await topicDB.findOneAndUpdate({_id: id.toString()}, {        $set: {"topicOwnerInfo.posts": user.posts.length}    })    const postsUpdate = await Promise.all(topicOwnerUpdate.posts.map(async post => {        const user = await userDB.findOne({username: post.postOwnerInfo.username})        post.postOwnerInfo.posts = user.posts.length        return post    }))    const topic = await topicDB.findOneAndUpdate({_id: id.toString()}, {posts: postsUpdate}, {new: true})    return topic}module.exports = {    addTopic: async (req, res) => {        const {title, description, photos, uploadedTopic} = req.body        const {email} = req.session        const user = await userDB.findOne({email})        const topic = await new topicDB({            topicOwner: user.username,            topicOwnerInfo: {                registered: user.createdAccount,                photo: user.photo,                posts: user.posts.length            },            title,            description,            photos,            uploadedTopic,            posts: [],            lastPostInfo: {                lastPostTime: new Date().getTime(),                lastPostUser: user.username            }        })        const newTopic = await topic.save()        const postInfo = {            id: newTopic._id,            title: newTopic.title,            postsCount: topic.posts.length,            lastPostInfo: topic.lastPostInfo        }        await userDB.findOneAndUpdate({email}, {$push: {topics: {$each: [postInfo], $position: 0}}}, {new: true})        res.send({success: true})    },    getAllTopics: async (req, res) => {        const allTopicsData = await topicDB.find()        const allTopics = await Promise.all(allTopicsData.map(async topics => {            const topic = await topicDB.findOne({_id: topics._id.toString()})            const newTopic = {                id: topic._id,                title: topic.title,                postsCount: topic.posts.length,                lastPostInfo: topic.lastPostInfo            }            return newTopic        }))        res.send({success: true, allTopics})    },    getUserTopics: async (req, res) => {        const {email} = req.session        const user = await userDB.findOne({email})        const userTopics = await Promise.all(user.topics.map(async topics => {            const topic = await topicDB.findOne({_id: topics.id})            const newTopic = {                id: topic._id,                title: topic.title,                postsCount: topic.posts.length,                lastPostInfo: topic.lastPostInfo            }            return newTopic        }))        res.send({success: true, topics: userTopics, topicsCount: userTopics.length})    },    getUserPosts: async (req, res) => {        const {email} = req.session        const user = await userDB.findOne({email})        const userPosts = await Promise.all(user.posts.map(async posts => {            const post = await topicDB.findOne({_id: posts.id})            const newPost = {                id: post._id,                title: post.title,                postsCount: post.posts.length,                lastPostInfo: post.lastPostInfo            }            return newPost        }))        res.send({success: true, posts: userPosts, postsCount: userPosts.length})    },    getTopicInfo: async (req, res) => {        const {id} = req.params        await updateTopic(id)        const topic = await topicDB.findOne({_id: id.toString()})        const totalPages = Math.ceil(topic.posts.length / 10);        res.send({success: true, topic, totalPages})    },    addPost: async (req, res) => {        const {topicID, description, photos, uploadedPost} = req.body        const {email} = req.session        const user = await userDB.findOne({email})        const post = {            postOwnerInfo: {                username: user.username,                registered: user.createdAccount,                photo: user.photo,                posts: user.posts.length            },            description,            photos,            uploadedPost        }        const newTopic = await topicDB.findOneAndUpdate({_id: topicID.toString()}, {            lastPostInfo: {                lastPostTime: uploadedPost, lastPostUser: user.username            },            $push: {posts: post},        }, {new: true})        const notificationInfo = {            id: newTopic._id,            title: description,            postsCount: newTopic.posts.length,            lastPostInfo: newTopic.lastPostInfo        }        if (newTopic.topicOwner !== user.username) {            await userDB.findOneAndUpdate({username: newTopic.topicOwner}, {                $push: {                    notifications: {$each: [notificationInfo], $position: 0}                },            }, {new: true})        }        const postInfo = {            id: newTopic._id,            title: newTopic.title,            postsCount: newTopic.posts.length,            lastPostInfo: newTopic.lastPostInfo        }        await userDB.findOneAndUpdate({email}, {$push: {posts: {$each: [postInfo], $position: 0}}}, {new: true})        const topic = await updateTopic(topicID)        res.send({success: true, topic})    },    sendFavoritesInfo: async (req, res) => {        const favorites = req.body        const favoriteTopics = await Promise.all(favorites.map(async favorites => {            const topic = await topicDB.findOne({_id: favorites})            const newTopic = {                id: topic._id,                title: topic.title,                postsCount: topic.posts.length,                lastPostInfo: topic.lastPostInfo            }            return newTopic        }))        res.send({success: true, favoriteTopics})    }}