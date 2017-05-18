require('../configs/mongodb_conn')()
const mongoose = require('mongoose')

var CSchema = mongoose.Schema({
    name: String,
    pid: mongoose.Schema.Types.ObjectId,
})

var CModel = mongoose.model('C', CSchema)

var PSchema = mongoose.Schema({
    name: String,
})


var PModel = mongoose.model('P', PSchema)

// CModel.create({
//     name: 'sub-呵呵1',
// })
// CModel.create({
//     name: 'sub-呵呵2'
// })

PModel.create({ name: '呵呵' }, (err, p) => {
    if (err) {
        return
    }
    CModel.create({
        name: 'sub-呵呵c1',
        pid: p._id,
    })
})
