const _pass = process.env.epass

module.exports = {
    host: 'smtp.163.com',
    port: 465,
    auth: {
        user: 'lsl981113093@163.com',
        // pass: _pass || process.env.epass,
        pass: 'wangyi4325968569'
    },
}
