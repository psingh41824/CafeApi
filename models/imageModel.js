const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({

    imageUrl : {
        type : String,
        required : true
    },
    offer : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Image',imageSchema)