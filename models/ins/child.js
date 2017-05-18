const mongoose = require('mongoose')

var ChildSchema = mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
})

var ChildModel = mongoose.model('Child', ChildSchema)

module.exports.ChildModel = ChildModel

module.exports.ChildSchema = ChildSchema;