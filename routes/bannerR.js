const Banner  = require('../models/bannerM')
const express = require('express')
const router = express.Router()
const upload = require('../helpers/multer')

router.get('/', async (req, res) => {
    try {
      const banner = await Banner.find();

      return res.status(200).json({
        success: true,
        msg:'Banner Data !',
        data: banner
    })
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/', upload.single('image'),async (req,res)=>{
    try{

    const file = req.file;
    if(!file) {
        return res.status(400).send('no image in the request')
    }
    const filename = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    let banner = new Banner({
        offer: req.body.offer,
        offerDate: req.body.offerDate,
        banner: `${basePath}${filename}`
        
    })
    banner = await banner.save()

    if(!banner)
    return res.status(404).send('banner cannot be created')

   res.status(200).send(banner);
   }
   catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
   }

})

module.exports = router;
