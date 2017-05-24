const mongoose = require('mongoose')
const debug = require('debug')

const CategorySchema = mongoose.Schema({
    _id: Number,
    name: String,
})

const CategoryModel = mongoose.model('Category', CategorySchema)

module.exports = CategoryModel
