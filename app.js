require( 'dotenv').config( ) ;
const express = require( 'express' ) 
const app = express ( ) 
const path = require( 'path' ) 
const bcrypt = require('bcrypt'); 
const mongoose = require( 'mongoose' ) ; 
const user = require( './models/user') ; 
const jwt = require( 'jsonwebtoken' ) ; 
const cookieParser = require( 'cookie-parser') ; 
const validator = require( 'validator' ) ;

mongoose.connect( 'mongodb://127.0.0.1:27017/VSMS' ,  { useNewUrlParser: true, useUnifiedTopology: true } )
    .then( ( ) => console.log( "mongo connected" ) ) 
    .catch( e => { 
        console.log( e ) 
    })

// authenticating token before after login
function authenticateToken(req, res, next) {
    const token = req.cookies.token ;

    if (!token) {
        return res.status(401).send("Token undefined");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen( 3000 ) 

app.set( 'views' , path.join( __dirname , 'views' ) ) 
app.set( 'view engine' , 'ejs' ) 

app.use(cookieParser());
app.use( express.static( path.join( __dirname , 'public' ) ))
app.use( express.urlencoded( { extended : true } )) 
app.use( express.json( ) ) 

app.get( "/" , ( req , res ) => { 
    res.render( 'login' , { message : '' , username : '' } )  ;
})

app.get( "/signup" , ( req , res ) => { 
    res.render( "signup" , { message: '' , username : ''} ) 
})

app.get( '/home' , authenticateToken , ( req , res ) => { 
    const username = req.user.username;
    res.render( "home" , { username } ) ; 
})

app.get( '/profile' , authenticateToken , ( req , res ) => { 
    const username = req.user.username ; 
    res.render( "profile" , { username , message : "" } ) ; 
})

app.post( '/update-password' , async ( req , res ) => { 
    const { username , password , new_password } = req.body ; 
    
    const current_user =  await user.findOne( { username : username } )
    console.log( "user found" ) 

    if( await bcrypt.compare( password , current_user.password ) ){ 
        const hashedPassword = await bcrypt.hash( new_password , 10); 

        current_user.password = hashedPassword ; 

        await current_user.save( ) 
             .then( ( ) => console.log( "password updated" ) )
             .catch( e => console.log( e ) ) 
            
        res.render( "profile" , { username , message : "password updated"})
    }
    else{ 
        res.render( "profile" , { username , message : "password is incorrect" } )
    }
})

app.post("/signup", async (req, res) => {
    try {
        console.log(req.body);
        
        const search_user = await user.findOne( { username : req.body.username } )

        if( search_user ){
            console.log( search_user )
            res.render( 'signup' , { message : "email aldredy exists" , username : req.body.username } )
        }
        else{
            const hashedPassword = await bcrypt.hash(req.body.password, 10); 

            const new_user = new user({
                username: req.body.username,
                password: hashedPassword
            });

            console.log(new_user);


            await new_user.save();
            console.log("User saved successfully");

            res.redirect("/");
        }

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Error during signup");
    }
});


app.post("/login", async (req, res) => {
    console.log(req.body); 

    const new_user =  await user.findOne( { username : req.body.username } ) 
    console.log( new_user ) ;

    if( new_user == null ){
        res.render ( "login" ,  { message : "user does not exist" , username : req.body.username } )
        res.status( 400 ).send( ) ; 
    }

    else{ 
        if( await bcrypt.compare( req.body.password , new_user.password ) ){ 
            console.log( "successfully logged in" )
            const obj = { username : req.body.username }

            const accessToken = jwt.sign( obj , process.env.ACCESS_TOKEN_SECRET )
            res.cookie( 'token' , accessToken , { httpOnly : true , sameSite : 'strict' , secure : true })

            res.redirect( '/home' ) 
        }
        else{ 
            res.render ( "login" ,  { message : "invalid password" , username : req.body.username } )
        }
    }
});



