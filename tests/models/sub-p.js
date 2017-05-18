const PModel = require('../../models/sub-p')
require('../../configs/mongodb_conn')()

var p = new PModel({
    name: '呵呵',
    children: [
        {
            name: 'sub-呵呵1',
        },
        {
            name: 'sub-呵呵2'
        }
    ]
})

p.save();