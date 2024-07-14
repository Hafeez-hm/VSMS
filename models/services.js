const mongoose = require('mongoose') 

const schema = mongoose.Schema( { 
    service_name : { type : String } , 
    description : { type : String } , 
    image_url : { type : String } , 
    time_slots: [
        {
          start_time: { type: String },
          end_time: { type: String },
          is_booked: { type: Boolean }
        }
      ]
})

const services = mongoose.model( 'services' , schema )  ; 

module.exports = services ; 
