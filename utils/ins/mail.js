const nodemailer = require('nodemailer')
const mailConfig = require('../../configs/email')
const siteConfig = require('../../configs/site')
const util = require('util')
const debug = require('debug')('my-app:utils:ins:mail')

const mailTransport = nodemailer.createTransport(mailConfig)

/**
 * 发送邮件
 *
 * @param {*} data 
 */
var sendMail = (data) => {
    mailTransport.sendMail(data, (err) => {
        debug('发送邮件回调 Err: %O', err)
        if (err) {
            debug('send mail error: %O', err)
        }
    })
}

module.exports.sendMail = sendMail


module.exports.sendActiveMail = (who, token, name) => {
    let from = util.format('%s <%s>', siteConfig.siteName, mailConfig.auth.user)
    let to = who
    let subject = siteConfig.siteName + ' - 注册账号'
    let html = `<p>您好：${name}</p>
                <p>我们收到您在${siteConfig.siteName}社区的注册请求。请点击下面的链接来激活账号：</p>
                <a href="${siteConfig.rootUrl}/active_account?key=${token}&name=${name}">激活链接</a>
                <p>若您没有在${siteConfig.siteName}社区填写过注册信息，可能是他人滥用或者错误使用了您的电子邮箱，请忽略或者直接删除此邮箱即可，我们对给您造成的打扰深感抱歉</p>
                <p>${siteConfig.siteName}社区 谨上。</p>`
    module.exports.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    })
}
