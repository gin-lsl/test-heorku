module.exports = {
    db_name: 'gin_blog',
    mongoConnConfig: {
        development: {
            connectionString: 'mongodb://127.0.0.1:27017/gin_blog'
        },
        production: {
            connectionString: 'mongodb://' + process.env.dbuser + ':' + process.env.dbpwd + '@ds031257.mlab.com:31257/gin_lsl'
        }
    }
}
