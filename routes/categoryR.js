const Category  = require('../models/categoryM')
const express = require('express')
const router = express.Router()
const upload = require('../helpers/multer')


  router.post('/',upload.single('image'), async (req, res) => {
    try {

    const file = req.file;
    if (!file){ return res.status(400).send('No image in the request') }
     
    const { name ,isSwitchOn} = req.body;
    if (!name) { return res.status(400).json({ error: 'Category name is required' });}

      let category = new Category({ 
        name,
        image:file.path,
        isSwitchOn
        
     });
      category = await category.save();
  
      return res.status(201).json({category});
      
    }
     catch(error){
        return res.status(400).json({
            success: false,
            msg:error.message
        })
    }
  });
  
  router.get('/', async (req, res) => {
    try {
      const categories = await Category.find();

      return res.status(200).json({
        success: true,
        msg:'User Profile Data!',
        data:categories
    })
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.put('/:id', async (req, res) =>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,

        },
        { new: true }
    )
    if(!category)
        return res.status(404).send('Category cannot be updated')

    res.status(200).send(category);
})

router.delete('/:id', (req, res)=>{
       
    Category.findOneAndDelete(req.params.id)
    .then(category =>{
        if(category){
            return res.status(200).json({
                success:true,
                message: 'Category deleted successfully'
            })
        }
        else {
            return res.status(404).json({ success: false, message: 'Category cannot find'})
        }
    })

    .catch(err =>{
          return res.status(404).json({ success: false, error:err})  
    })
    
})  


module.exports = router ;