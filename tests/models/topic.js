var Topic = require('../../models/topic')
require('../../configs/mongodb_conn')()
var debug = require('debug')('my-app:tests:models:topic')

Topic.find((err, topics) => {
    debug('查询是否已经存在topic')
    if (topics.length) {
        debug('数据库中已经存在topic对象')
        process.exit(1)
    }
    debug('数据库中没有topic对象')
    new Topic({
        title: '第一个帖子',
        content: '第一个帖子内容',
        category: 'nodejs',
        tags: [
            'nodejs',
            'express',
            'mongodb',
            'mongoose',
            'cluster'
        ],
        postDateTime: new Date()
    }).save()

    new Topic({
        title: '第二个帖子',
        content: '第二个帖子内容',
        category: 'java',
        tags: [
            'java',
            'java web',
            'Spring',
            'Spring MVC',
            'redis'
        ],
        postDateTime: new Date()
    }).save()

    new Topic({
        title: '第三个帖子',
        content: '第三个帖子内容',
        category: 'C#',
        tags: [
            'C#',
            '.Net MVC',
            'ASP',
            'ASP.Net',
            'Http'
        ],
        postDateTime: new Date()
    }).save()
});