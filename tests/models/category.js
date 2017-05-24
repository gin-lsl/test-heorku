require('../../configs/mongodb_conn')()
const CategoryModel = require('../../models').CategoryModel

CategoryModel.find((err, data) => {
    if (data && data.length) {
        process.exit(1)
    }
    CategoryModel.create({
        _id: 0,
        name: '其他'
    })
    CategoryModel.create({
        _id: 1,
        name: 'Node.js',
    })
    CategoryModel.create({
        _id: 2,
        name: 'Java',
    })
    CategoryModel.create({
        _id: 3,
        name: 'C#',
    })
    CategoryModel.create({
        _id: 4,
        name: 'PHP',
    })
    CategoryModel.create({
        _id: 5,
        name: 'Python',
    })
})
