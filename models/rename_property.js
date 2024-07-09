// const user = require( './user' ) ; 
// const mongoose = require( 'mongoose' ) ; 

// mongoose.connect( 'mongodb://127.0.0.1:27017/VSMS' ,  { useNewUrlParser: true, useUnifiedTopology: true } )
//     .then( ( ) => console.log( "mongo connected" ) ) 
//     .catch( e => { 
//         console.log( e ) 
//     })

// async function update_users( ){
//     try{ 
//         await user.updateMany( { name : { $exists : true } } ,  {$rename: { 'name' :'username' } })
//             .then( console.log( "updated successfully ") ) 
//             .catch( e => console.log( e ) ) 
//     }
//     catch{
//         console.log( "failed  to update " )
//     }
// }

const mongoose = require('mongoose');
const user = require('./user'); // Replace with the actual path to your User model

mongoose.connect('mongodb://localhost:27017/VSMS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function updateUsers() {
    try {
        // Update all users to rename 'username' field to 'name'
        await user.updateMany(
            { name: { $exists: true } }, // Find documents with 'username' field
            { $rename: { 'name': 'username' } } // Rename 'username' field to 'name'
        );
        console.log('Users updated successfully');
    } catch (error) {
        console.error('Error updating users:', error);
    } finally {
        mongoose.connection.close();
    }
}

updateUsers();
