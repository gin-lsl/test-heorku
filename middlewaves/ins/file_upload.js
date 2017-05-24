const multer = require('multer')
const debug = require('debug')('my-app:middlewaves:file_upload')

const storage = multer.diskStorage({
    // 路径
    destination: (req, file, callback) => {
        callback(null, 'public/images/covers/')
    },
    // 文件名
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

module.exports = upload
