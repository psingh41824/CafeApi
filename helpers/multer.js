const multer =  require('multer')
const fs = require('fs');
const uploadDirectory = 'public/uploads';

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, uploadDirectory); // Use the uploadDirectory variable
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);
    }
});

const upload = multer({ storage: storage })

module.exports = upload;
