function verifyStudentID(sid){
    // A valid ID:
    // - 10 characters long
    // - first character is 4
    // - contains only digits 0-9
    // - Keep ID as a string, reject spaces, letters, and punctuation 

    if(sid.length !== 10){
        return false;
    }

    if(sid[0] !== '4'){
        return false;
    }

    for(let i = 0; i < sid.length; i++){
        if(sid[i] < '0' || sid[i] > '9'){
            return false;
        }
    }

    return true;
}

function verifyPwd(pwd){
    // A valid password is:
    // - At least 12 characters long
    // - contains only ASCII letters A-Z or a-z, digits 0-9, or the special characters &, $, #, and @
    // - includes at least one uppercase letter, one digit and one special character
    // - A lowercase letter is allowed but not required
    // - Passwords are case-sensitive
    let hasDigit = false;
    let hasSymbol = false;
    let hasUpperCase = false;

    if(pwd.length <= 11){
        return false;
    }

    for(let i = 0; i < pwd.length; i++){
        const isLetter = (pwd[i] >= 'a' && pwd[i] <='z') || (pwd[i] >= 'A' && pwd[i] <= 'Z');
        const isDigit = (pwd[i] >= '0' && pwd[i] <= '9');
        const isUpperCase = (pwd[i] >= 'A' && pwd[i] <= 'Z');
        const isSymbol = '&#$@'.includes(pwd[i]);

        if(!isLetter && !isDigit && !isSymbol){
            return false;
        }

        if(isDigit){
            hasDigit = true;
        }

        if(isUpperCase){           
            hasUpperCase = true;
        }

        if(isSymbol){
            hasSymbol = true;
        }

    }

    return hasDigit && hasUpperCase && hasSymbol;

}

function verifyEmail(email){
    // Required for the email
    // - exactly one @
    // - at least one before @
    // - local part may contain ASCII letters, digits, dot, underscores or hyphens
    // - domain must be exactly uwistudents.net, uwi.edu, or cavehill.uwi.edu.
    // - case-insensitively
    // - no spaces or extra domain suffices

    email = email.toLowerCase();

    let atSign = 0; 
    let atCount = 0;

    for(let i = 0; i < email.length; i++){
        if(email[i] === '@'){
            atSign = i;
            atCount++;
        }
        if(email[i] === " "){
            return false;
        }
        if(!(
            (email[i] >= 'a' && email[i] <= 'z') || (email[i] >= '0' && email[i] <= '9') ||
            email[i] === "." || email[i] === "_" || email[i] === "-" || email[i] === "@")){
                return false;
            }
    }

    if(atCount !== 1){
        return false
    }

    if(email[0] === '@'){
        return false;
    }

    let domain = email.substring(atSign + 1);


    if(domain !== "uwistudents.net" && domain !== "uwi.edu" && domain !== "cavehill.uwi.edu"){
        return false
    }
    return true;

}