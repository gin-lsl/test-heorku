var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var credentials = require('./configs/credentials')
var session_config = require('./configs/session_config')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(expressSession)
const mongoConnConfig = require('./configs/mongodb_config').connStr
var debug = require('debug')('my-app:app')

// 链接数据库
require('./configs/mongodb_conn')()

// var domain = require('domain')

var index = require('./routes/index')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


// 引入 domain 中间件,需要在所以的中间件和路由之前引入,
// 所以的请求都在一个独立的 domain 中
// domain来处理异常
// app.use((req, res, next) => {
//   let d = domain.create()
//   // 监听 domain 的错误事件
//   d.on('error', err => {
//     debug(err)
//     res.status(500)
//     res.json({
//       success: false,
//       msg: '服务器异常'
//     })
//     d.dispose()
//   })

//   d.add(req)
//   d.add(res)

//   d.run(next)
// })



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// cookie
app.use(cookieParser())

// session
app.use(expressSession({
    store: new MongoStore({
        url: mongoConnConfig()
    }),
    secret: credentials.cookieSecret,
    cookie: session_config.cookie,
    key: session_config.key,
    saveUninitialized: true,
    resave: false
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    debug('session: %O', req.session)
    next()
})

app.use('/', index)

app.use('/fail', (req, res) => {
    throw new Error('同步错误')
})

app.use('/async-fail', (req, res) => {
    process.nextTick(() => {
        throw new Error('异步错误')
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

// process.on('uncaughtException', (err) => {
//   debug(err)
// })

module.exports = app
