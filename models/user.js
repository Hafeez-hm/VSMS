const mongoose = require( 'mongoose') ; 

const schema =  mongoose.Schema( {
    username : { type : String , required : true } , 
    password : { type : String , required : true } 
})

const user = mongoose.model( 'user' , schema ); 

module.exports = user ; 
