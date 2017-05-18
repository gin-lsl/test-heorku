/**
 * 匹配邮箱
 */
const regexEmail = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;

/**
 * 匹配全都是数字
 */
const regexPureNumber = /^[0-9]+$/;

/**
 * 验证邮箱是否合法
 *
 * @param {String} email
 * @return {Boolean} 是否合法
 */
module.exports.validEmail = (email) => {
    return regexEmail.test(email);
}


/**
 * 检查字符串是否所有字符都是数字
 *
 * @param {String} str 要检查的字符串
 * @return {Boolean} 是否全是数字组成的
 */
module.exports.pureNumber = (str) => {
    return regexPureNumber.test(str);
}
