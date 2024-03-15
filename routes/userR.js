const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userM');
const multer =  require('multer')
const fs = require('fs');
const { addValidator } = require('../helpers/validation');
const uploadDirectory = 'public/uploads';
const { validationResult } = require('express-validator');

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

router.post('/register',upload.single('image'),addValidator, async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            msg:'Errors',
            errors:errors.array().map(error => error.msg)
        })
    }
    const isExists = await User.findOne({email: req.body.email})
        if(isExists){
            return res.status(400).json({
                success : false,
                msg: 'Email Already Exists!'
            })
        }

    const filename = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        image: `${basePath}${filename}`
    })

    user = await user.save();
    if(!user){
        return res.status(404).send('User cannot be created')
    }
    res.status(200).json({success : true,
    user:user })
})

router.get('/', async (req, res) =>{

    const user = await User.find().select('-password')
    if(!user){
       res.send(500).json({  success : false })
    }
    res.status(200).json({
        success : true,
        user : user
    })
})

router.get ('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(500).json({ success: false, message: 'The user with the given ID not exists' })
    }
    res.status(200).send(user)
    
})

router.delete('/:id', (req, res) => {
    User.findOneAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'User deleted successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'User cannot find' })
        }
    }).catch(err => {
        return res.status(400).json({
             success: false,
              error: err })
    })
})


module.exports = router;