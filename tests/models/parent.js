const ParentModel = require('../../models/parent')
const ChildModel = require('../../models/child').ChildModel
require('../../configs/mongodb_conn')()

ParentModel.find((err, parents) => {
    if (parents && parents.length > 0) {
        console.log('以及存在')
        process.exit(1)
    }
    // let _c = new ChildModel({
    //     name: '大头儿子',
    //     age: 10,
    //     gender: '男'
    // }).save()
    new ParentModel({
        name: '小头baba',
        children: [
            {
                name: '大头儿子',
                age: 10,
                gender: '男'
            }
        ]
    }).save()
})