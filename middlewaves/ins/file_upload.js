const multer = require('multer')
const debug = require('debug')('my-app:middlewaves:file_upload')

const storage = multer.diskStorage({
    // 路径
    destination: (req, file, callback) => {
        debug('req.url: %s', req.url)
        callback(null, 'public/images/covers/')
    },
    // 文件名
    filename: (req, file, callback) => {
        // 需要注意防止文件名太长
        let filename = Date.now() + file.originalname.substr(-15)
        // filename = filename.substr(-25)
        debug('将保存的文件名: %O', filename)
        req.coverImageName = filename
        callback(null, filename)
    }
})

const upload = multer({
    storage: storage
})

module.exports = upload
