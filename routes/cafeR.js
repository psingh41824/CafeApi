const mongoose = require('mongoose')

const express = require('express')
const router =  express.Router()
const Cafe = require('../models/cafeM')
const Category = require('../models/categoryM')
const Product = require('../models/productM')
const Banner = require('../models/bannerM')

router.get('/', async (req, res) =>{

    const cafe = await Cafe.find()
    .populate('banner')
    .populate('recommend')
    .populate('category')
    .populate({ path: 'recommend', populate: { path: 'category' } })
    .exec();
    if (!cafe || cafe.length === 0) {
        res.status(500).json({ success: false })
    }
    res.status(200).json({
        success : true,
        data : {cafe}
    })

})

router.post('/', async (req,res)=>{
    try{

    const banner = await Banner.findById(req.body.bannerId)  
    if(!banner){
        return res.status(400).send('Invalid Banner')
    }

    const category = await Category.findById(req.body.categoryId)
    if(!category) {
        return res.status(400).send('Invalid Category')
    }

    const product = await Product.findById(req.body.productId)
    if(!product) {
        return res.status(400).send('Invalid Product')
    }

    let cafe = new Cafe({
        banner :  banner._id,
        category : category._id,
        recommend: product._id
        
    })
    cafe = await cafe.save()

    if(!cafe)
    return res.status(404).send('cafe cannot be created')

   res.status(200).send(cafe);
}
catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}

})

module.exports = router;

