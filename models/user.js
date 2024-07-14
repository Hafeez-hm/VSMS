const mongoose = require( 'mongoose') ; 

const schema =  mongoose.Schema( {
    username : { type : String , required : true } , 
    password : { type : String , required : true } , 
    bookings: [
        {
          service_name : { type : String } , 
          time_slot : { type : String }
        }
        
      ]
})

const user = mongoose.model( 'user' , schema ); 

module.exports = user ; 
