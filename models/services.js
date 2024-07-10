const mongoose = require('mongoose') 

const schema = mongoose.Schema( { 
    service_name : { type : String } , 
    description : { type : String } , 
    image_url : { type : String } 
})

const services = mongoose.model( 'services' , schema )  ; 

module.exports = services ; 
