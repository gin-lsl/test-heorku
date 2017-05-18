var cluster = require('cluster')

/**
 * 启动一个工作线程
 */
function startWorker() {
    let worker = cluster.fork()
    console.log('-CLUSTER: Worker %d started.', worker.id)
}

if (cluster.isMaster) {
    require('os').cpus().forEach(function () {
        // 为每个CPU核心启动服务器
        startWorker()
    })

    // 纪录所有断开的工作线程, 如果工作线程断开, 它应该退出
    // 因此, 我们可以等待exit事件, 然后繁衍一个新的工作线程来代替它.
    cluster.on('disconnect', function (worker) {
        console.log('-CLUSTER: Worker %d died with exit code %d (%s).', worker.id)
    })

    // 当有工作线程死掉(退出)时, 创建一个工作线程代替它.    
    cluster.on('exit', function (worker, code, signal) {
        console.log('-CLUSTER: Worker %d died with exit code %d (%s).', worker.id, code, signal)
        startWorker()
    })
} else {
    // 在这个工作线程上启动应用服务器.
    require('./app')()
}