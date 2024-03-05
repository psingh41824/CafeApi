const Image = require('../models/imageModel')
const Category = require('../models/categoryModel')
const {validationResult} = require('express-validator')


const addImage = async ( req , res ) => {

    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                msg:'Errors',
                errors:errors.array().map(error => error.msg)
            })
        }

        const images = new Image({
            imageUrl : req.file.filename,
            offer: req.body.offer,
            date: req.body.date,
          });
      
        const newImages = await images.save()

        return res.status(200).json({
            success: true,
            msg:'Registered successfully!',
            images: newImages
        })

    }catch(error){
        return res.status(200).json({
            success : false,
            msg : error.message
        })
    }
}

const getAllImages = async ( req , res ) => {

    try{

        const images = await Image.find();

        return res.status(200).json({
            success : true,
            images: images,
            msg : 'Get All Images'
        })

    }catch(error){
        return res.status(400).json({
            success : false,
            msg : error.message
        })
    }

}

const createCategory = async (req , res ) => {
    try {
        
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                msg:'Errors',
                errors:errors.array().map(error => error.msg)
            })
        }

        const category = new Category({
            name: req.body.name,
            icon: req.file.filename ,//req.file ? req.file.filename : '', // Check if req.file exists before accessing its properties
            color: req.body.color
        });

        const categoryData = await category.save();

        return res.status(201).json({
            success: true,
            msg: 'Category created successfully!',
            category: categoryData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};

const getCategory = async (req , res ) => {
    try{

        const category = await Category.find();

        return res.status(200).json({
            success : true,
            images: category,
            msg : 'Get All Category Data'
        })

    }catch(error){
        return res.status(400).json({
            success : false,
            msg : error.message
        })
    }
}

module.exports = { addImage , getAllImages, createCategory , getCategory };