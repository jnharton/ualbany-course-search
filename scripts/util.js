function filter(func_ptr, array) {
    var arr = new Array();
    
    var n = 0;
    
    for(var index = 0; index < arr.length; index++) {
       if( func_ptr(array[index]) ) {
           arr[n] = array[index];
           n = n + 1;
       }
    }
}

function is_empty(s) {
    if( s === '' ) return false;
    else           return true;
}

function clearValue(defaultValue, element) {
    if( element.value === defaultValue ) element.value = '';
}

function resetValue(defaultValue, element) {
    if( !( validate(element.value) ) ) {
        element.value = defaultValue;
    }
}

function validate(value) {
    if( value == '' ) return false;
    else              return true;
}

function localstorage_support() {
    return localstorage_support(false);
}

function localstorage_support(show_message) {
    var support = false;
    
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        if( show_message ) {
            //alert('Yay! HTML5 Web Storage IS supported!');
            showMessage('Yay! HTML5 Web Storage IS supported!');
        }
        support = true;
    }
    else {
        // Sorry! No Web Storage support..
        if( show_message ) {
            showMessage('HTML5 Web Storage NOT supported!');
        }
    }
    
    return support;
}

function showMessage(message) {
    var width = window.outerWidth;
    var height = window.outerHeight;
    
    var sTop = (height / 2) - 50;
    var sLeft = (width / 2) - 100;
    
    var myWindow = window.open('', 'Message', 'width=200, height=100' + ', top=' + sTop + ', left=' + sLeft);
    
    myWindow.document.write('<p>' + message +  '</p>');
    
    setTimeout(function(){ myWindow.close() }, 1000);
}

function load() {
    if( localstorage_support() ) {
        var user = sessionStorage.getItem('user');
        var loggedIn = sessionStorage.getItem('isLoggedIn');
        
        if( user == null || loggedIn == null ) return;
        else {
            if( loggedIn ) {
                // disappear login form
                var loginForm = document.getElementById("login_form");
                
                loginForm.style.visibility = "hidden";
                
                // show logout button
                var logoutButton = document.getElementById("logout_btn");
                
                logoutButton.style.display = "";
                
                // show logged-in
                var label = document.getElementById("current_user");
                
                label.innerHTML = 'Logged in as ' + sessionStorage.getItem('user');
            }
        }
    }
}

function test() {
    var subjects = {
        'africana':　'AAFR',
        'anthropology': 'AANT',
        'arabic': 'AARA',
        'art history': 'AARH',
        'art': 'AART',
        'arts': 'ACAS',
        'atmos': 'AATM',
        'biology': 'ABIO',
        
        'greek': 'ACLG',
        'latin': 'ACLL',
        'danish': 'ADAN',
        'dutch': 'ADCH',
        'chinese': 'EAC',
        'japanese': 'EAJ',
        'korean': 'EAK',
        'french': 'AFRE',
        'german': 'AGER',
        'hebrew': 'AHEB',
        'italian': 'AITA',
        
        
        //'business': 'BACC',
        //'': 'BBUS',
        //'': 'BFIN',
        //'': 'BFOR',
        'management': 'BITM',
        //'business': 'BLAW',
        //'': 'BMGT',
        'marketing': 'BMKT',
        //'': 'BORG',
        
        'computer': 'ICSI',
        'computer engineering': 'ICEN',
        'informatics': 'IINF',
        'information studies': 'IIST',
        
        'educational administration': 'EAPS',
        'counseling psychology': 'ECPY',
        'education': 'EEDU',
        'literacy teaching': 'ELTL',
        'philosophy of education': 'EPHL',
        'education psychology': 'EPSY',
        'special education': 'ESPE',
        'school psychology': 'ESPY',
        'practice': 'ETAP'
    };
    
    var temp = document.getElementById('programs').value;
    var subject_code = subjects[temp];
    
    if( subject_code == null ) subject_code = '';
    
    document.getElementById('subject').value = subject_code;
}