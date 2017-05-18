const mongoose = require('mongoose')
const ChildSchema = require('./child').ChildSchema

var ParentSchema = mongoose.Schema({
    name: String,
    children: [ChildSchema]
})

var ParentModel = mongoose.model('Parent', ParentSchema)

module.exports = ParentModel