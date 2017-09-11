// get login database (all data should be hashed so that no usernames or passwords are usably visible without brute force hash undo)
function get_authdb() {
    /*var JSON;
    
    $.getJSON('data.json', function(response){
        JSON = response;
        alert(JSON.property);
    })
    //feel free to use chained handlers, or even make custom events out of them!
    .success(function() { alert("second success"); })
    .error(function() { alert("error"); })
    .complete(function() { alert("complete"); });
    
    return JSON;*/
    return { 'jeremy': 'password' };
}

function login() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    
    var auth_success = authenticate(user, pass);
    
    if( auth_success ) {
        if( localstorage_support(true) ) {
            // set logged-in status
            sessionStorage.setItem('user', user);
            sessionStorage.setItem('isLoggedIn', true);
            
            // disappear login form
            var loginForm = document.getElementById("login_form");
            
            loginForm.style.visibility = "hidden";
            
            // show logout button
            var logoutButton = document.getElementById("logout_btn");
            
            logoutButton.style.display = "";
            
            // show logged-in
            var label = document.getElementById("current_user");
            
            label.innerHTML = 'Logged in as ' + user;
            
            loginForm.reset();
        }
    }
    else {
        var label = document.getElementById("current_user");
        
        label.innerHTML = 'Invalid Username or Password!';
    }
}

function logout() {
    if( localstorage_support() ) {
        // hide logged-in
        document.getElementById("current_user").innerHTML = '';
        
        // hide logout button
        var logoutButton = document.getElementById("logout_btn");
        
        logoutButton.style.display = "none";
        
        // show login form
        var loginForm = document.getElementById("login_form");
        
        loginForm.style.visibility = "";
        
        // remove logged-in status
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        
        loginForm.reset();
    }
}

function authenticate(user, pass) {
    var db = get_authdb();
    
    var user_hash = hash( user );
    var pass_hash = hash( pass );
    
    // should look through db for a set of matching hashes (test every case even if user didn't match, for security!)
    if( db[user_hash] === pass_hash ) return true;
    else                              return false;
}

function hash(string) {
    return string;
}