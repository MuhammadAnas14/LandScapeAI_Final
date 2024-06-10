const mongoose = require("mongoose");


const ImagesSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    ImageUrl:{
        type :String,
        require:true
    },
    Feedback: {
        type: String,
        require:true,
    },
})

module.exports = mongoose.model('Images', ImagesSchema);