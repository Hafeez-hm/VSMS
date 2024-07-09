function validate( ){
    let username = document.getElementById( "username").value ; 
    let password = document.getElementById( "password").value ; 
    
    let error_msg = '' ; 
    
    if( !username )
        error_msg += "fill email field " ; 
    if( !password )
        error_msg += "fill password feld "

    if( error_msg ){
        alert( error_msg )
        return false ;  
    }
    
    return true ;
    
}