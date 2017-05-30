const { CategoryModel } = require('../../models')
const debug = require('debug')('my-app:controllers:ins:category')


/**
 * 返回所有分类
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findAllCategory = (req, res) => {
    CategoryModel.find({}, { _id: 1, name: 1 }, (err, findAllRes) => {
        debug('查询所有分类结果 Err: %O, findAllRes: %O', err, findAllRes)
        return res.json({
            success: !err,
            data: findAllRes
        })
    })
}
