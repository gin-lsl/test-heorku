var mongoose = require('mongoose')

/**
 * 定义 Topic 模式
 */
var TopicSchema = mongoose.Schema({
    title: String,
    content: String,
    category: Number,
    tags: [String],
    postDateTime: Date,
    visit: Number,
    userId: mongoose.Schema.Types.ObjectId,
    cover: String,
})

/**
 * 定义模型
 */
var TopicModel = mongoose.model('Topic', TopicSchema)

module.exports = TopicModel

function getDateString(date) {
    let _date = new Date(date)
    return `${_date.getFullYear()}-${_date.getMonth()}-${_date.get_dateay()} ${_date.getHours()}:${_date.getMinutes()}:${_date.getSeconds()}`
}
