const connConfig = {
    development: {
        connectionString: 'mongodb://127.0.0.1:27017/gin_blog'
    },
    production: {
        // 直接使用环境变量，指定 dbuser 和 dbpwd
        connectionString: 'mongodb://' + process.env.dbuser + ':' + process.env.dbpwd + '@ds031257.mlab.com:31257/gin_lsl'
    }
}

module.exports = {
    /**
     * 数据库名称
     */
    db_name: 'gin_blog',
    /**
     * 指定连接字符串
     */
    mongoConnConfig: connConfig,
    /**
     * 根据当前配置的环境变量，获取MongoDB连接字符串
     */
    connStr: function () {
        let env = process.env.env
        return connConfig[env].connectionString
    }
}
