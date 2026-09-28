let currentUser = null;

function showView(viewId){
    const views = document.getElementsByClassName("view");

    for(let i = 0; i < views.length; i++){
        views[i].style.display = "none";
    }

    document.getElementById(viewId).style.display = "block";
}

function setMessage(elementId, message){
    const element = document.getElementById(elementId);
    if(element !== null){
        element.textContent = message;
    }
}

function toggleVisibility(trigger, selector, show){
    const view = trigger.closest(".view");        
    const element = view.querySelector(selector); 

    if(show === undefined){
        element.classList.toggle("hidden");
    } else {
        element.classList.toggle("hidden", !show);
    }
}

function clearFormMessages(){
    setMessage("borrowerError", "");
    setMessage("technicianError", "");
    setMessage("managerError", "");

    const toggles = document.querySelectorAll(".menuList, .notice");
    for(let i = 0; i < toggles.length; i++){
        toggles[i].classList.add("hidden");
    }
}

function goHome(){
    clearFormMessages();
    showView("WelcomeHome");
}

function loginBorrower(data){
    let validStudentID = verifyStudentID(data.studentId);
    let validPassword = verifyPwd(data.password);

    if(!validStudentID) {
        return "Invalid Student ID";
    }

    if(!validPassword){
        return "Invalid Password Format"
    }

    for(let i = 0; i < borrowers.length; i++){
        if(borrowers[i].studentId === data.studentId && borrowers[i].password === data.password){
            currentUser ={
                role: "borrower",
                firstName: borrowers[i].firstName,
                lastName: borrowers[i].lastName,
                credential: borrowers[i].studentId
            };

            return "";
        }
    }
    return "Student ID or password not recognised";
}

function loginRole(data){
    let validEmail = verifyEmail(data.email);
    let validPassword = verifyPwd(data.password);
    let roles;

    if(!validEmail) {
        return "Invalid Email Address Format";
    }

    if(!validPassword){
        return "Invalid Password Format";
    }

    
    if(data.role === 'technician'){
        roles = technicians;
    } else if (data.role === 'manager'){
        roles =  managers; 
    }else {
        return "That role is not permitted to log in here";
    }

    for(let i = 0; i < roles.length; i++){
        if(roles[i].email === data.email && roles[i].password === data.password){
            currentUser ={
                firstName: roles[i].firstName,
                lastName: roles[i].lastName,
                role: data.role,
                credential: roles[i].email
            };

            return "";
        }
    }
    return "Email or password not recognised";
}

function submitBorrowerForm(){
    const StudentId = document.getElementById("studentId").value;
    const Password = document.getElementById("studentPassword").value;

    clearFormMessages();

    const data = {
        studentId: StudentId,
        password: Password
    };

    let errorMessage = loginBorrower(data); 
    
    if(errorMessage !== ""){
        setMessage("borrowerError", errorMessage);
        return false;
    }

    document.getElementById("consoleUser").textContent = currentUser.firstName + " " + currentUser.lastName + "   |   " + currentUser.credential;

    showView("borrowerConsole");
    return false;
}

function submitTechnicianForm(){
    const Email = document.getElementById("technicianEmail").value;
    const Password = document.getElementById("technicianPassword").value;
    const Role = document.getElementById("technicianRole").value;

    clearFormMessages();

    const data = {
        email: Email,
        password: Password,
        role: Role
    };

    let errorMessage = loginRole(data); 
    
    if(errorMessage !== ""){
        setMessage("technicianError", errorMessage);
        return false;
    }

    document.getElementById("consoleUser").textContent = currentUser.firstName + " " + currentUser.lastName + "   |   " + currentUser.credential;

    showView("");
    return false;
}

function findLostPassword(data){
    const successMessage = document.getElementById("recoverPassword");
    let validEmail = verifyEmail(data.email);
    let roles;

    if(!validEmail) {
        return "Invalid Email Address Format";
    }

    if(data.role === 'technician'){
        roles = technicians;
    } else if (data.role === 'manager'){
        roles =  managers; 
    }else {
        return "That role is not permitted to log in here";
    }

    for( let i = 0; i < roles.length; i++){
        if(roles[i].email === data.email){
            currentUser ={
                firstName: roles[i].firstName,
                lastName: roles[i].lastName,
                role: data.role,
                credential: roles[i].email
            };
            return ""
        }
    }
    return "No account associated with this email";

}

function submitTechnicianRecoveryForm(){
    const Email = document.getElementById("technicianEmail").value;
    const Role = document.getElementById("technicianRole").value;

    clearFormMessages();

    const data = {
        email: Email,
        role: Role
    };

    let errorMessage = loginRole(data); 
    
    if(errorMessage !== ""){
        setMessage("technicianError", errorMessage);
        return false;
    }

    document.getElementById("consoleUser").textContent = currentUser.firstName + " " + currentUser.lastName + "   |   " + currentUser.credential;

    showView("");
    return false;

}

function startApp(){
    loadData();
    currentUser = null;
    showView("welcomeView");
}