const userDB = require('../models/userSchema')const topicDB = require('../models/topicSchema')module.exports = {    addTopic: async (req, res) => {        const {title, description, photos, uploadedTopic} = req.body        const {email} = req.session        const user = await userDB.findOne({email})        const topic = await new topicDB({            topicOwner: user.username,            title,            description,            photos,            uploadedTopic,            posts: [],            lastPostTime: new Date().getTime()        })        await topic.save()        res.send({success: true})    }}