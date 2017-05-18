var UserModel = require('../../models/user')
require('../../configs/mongodb_conn')()
var debug = require('debug')('my-app:tests:models:user')

UserModel.find((err, users) => {
    debug('查询是否存在users')
    if (users.length) {
        debug('数据库中已经存在users')
        process.exit(1)
    }

    new UserModel({
        email: 'gin_lsl@outlook.com',
        name: '荷兰酒',
        password: 'gin_lsl',
        gender: '男',
        lv: 12,
        say: '呵呵,呵呵啊呵呵'
    }).save()

    new UserModel({
        email: 'd@d.com',
        name: '荷兰酒ddd',
        password: 'dd',
        gender: '男',
        lv: 12,
        say: '呵呵,呵呵啊呵呵ddd'
    }).save()

    new UserModel({
        email: 'a@a.com',
        name: 'aaa',
        password: 'a',
        gender: '男',
        lv: 12,
        say: 'aaaaaaaaaaaaaaaaaaaaa'
    }).save()

})