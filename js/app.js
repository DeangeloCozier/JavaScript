let currentUser = null;
const valid_Roles = ["borrower", "technician", "manager"];

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
    setMessage("technicianRecoveryError", "");
    setMessage("managerError", "");
    setMessage("managerRecoveryError", "");

    const toggles = document.querySelectorAll(".menuList, .notice");
    for(let i = 0; i < toggles.length; i++){
        toggles[i].classList.add("hidden");
    }

    document.getElementById("equipmentBtn")?.classList.remove("selected");
    document.getElementById("collectionBtn")?.classList.remove("selected");
    document.getElementById("equipmentTable")?.classList.add("hidden");
    document.getElementById("collectionTable")?.classList.add("hidden");
    document.getElementById("panelHeading")?.classList.add("hidden");
    document.getElementById("borrowersBtn")?.classList.remove("selected");
    document.getElementById("techniciansBtn")?.classList.remove("selected");
    document.getElementById("borrowersTable")?.classList.add("hidden");
    document.getElementById("techniciansTable")?.classList.add("hidden");
    document.getElementById("managerHeading")?.classList.add("hidden");
    document.getElementById("newUserButton")?.classList.add("hidden");
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
        if(roles[i].email.toLowerCase() === data.email.toLowerCase() && roles[i].password === data.password){
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

    document.getElementById("borrowerConsoleUser").textContent = currentUser.firstName + " " + currentUser.lastName + "   |   " + currentUser.credential;

    openConsole("borrower");
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

    document.getElementById("technicianConsoleUser").textContent = currentUser.firstName + " " + currentUser.lastName + "   |   " + currentUser.credential;

    openConsole("technician");
    return false;
}

function findLostPassword(data){
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
        if(roles[i].email.toLowerCase() === data.email.toLowerCase()){
           
            return ""
        }
    }
    return "No";

}

function submitTechnicianRecoveryForm(){
    const Email = document.getElementById("technicianRecoveryEmail").value;
    const Role = document.getElementById("technicianRecoveryRole").value;

    clearFormMessages();

    document.getElementById("recoverPassword").classList.add("hidden");

    const data = {
        email: Email,
        role: Role
    };

    let errorMessage = findLostPassword(data); 
    
    if(errorMessage !== "" && errorMessage !== "No"){
        setMessage("technicianRecoveryError", errorMessage);
        return false;
    }

    if(errorMessage === "No"){
        setMessage("recoverMessage", "No account associated with this email.");
        document.getElementById("recoverPassword").classList.remove("hidden");
        return false;
    }

    if(errorMessage === ""){
        setMessage("recoverMessage", "Demo recovery request accepted. No email has been sent.");
        document.getElementById("recoverPassword").classList.remove("hidden");
        return false;
    }



    // showView("");
    return false;

}

function submitManagerForm(){
    const Email = document.getElementById("managerEmail").value;
    const Password = document.getElementById("managerPassword").value;
    const Role = document.getElementById("managerRole").value;

    clearFormMessages();

    const data = {
        email: Email,
        password: Password,
        role: Role
    };

    let errorMessage = loginRole(data); 
    
    if(errorMessage !== ""){
        setMessage("managerError", errorMessage);
        return false;
    }

    document.getElementById("managerConsoleUser").textContent = currentUser.firstName + " " + currentUser.lastName + "   |   " + currentUser.credential;

    openConsole("manager");
    return false;
}

function submitManagerRecoveryForm(){
    const Email = document.getElementById("managerRecoveryEmail").value;
    const Role = document.getElementById("managerRecoveryRole").value;

    clearFormMessages();

    document.getElementById("recoverManagerPassword").classList.add("hidden");

    const data = {
        email: Email,
        role: Role
    };

    let errorMessage = findLostPassword(data); 
    
    if(errorMessage !== "" && errorMessage !== "No"){
        setMessage("managerRecoveryError", errorMessage);
        return false;
    }

    if(errorMessage === "No"){
        setMessage("recoverManagerMessage", "No account associated with this email.");
        document.getElementById("recoverManagerPassword").classList.remove("hidden");
        return false;
    }

    if(errorMessage === ""){
        setMessage("recoverManagerMessage", "Demo recovery request accepted. No email has been sent.");
        document.getElementById("recoverManagerPassword").classList.remove("hidden");
        return false;
    }



    // showView("");
    return false;

}

function selectPanel(panel){
    if(!requireRole("technician")){
        return;
    }

    document.getElementById("equipmentBtn").classList.toggle("selected", panel === "equipment");
    document.getElementById("collectionBtn").classList.toggle("selected", panel === "collection");

    document.getElementById("equipmentTable").classList.toggle("hidden", panel !== "equipment");
    document.getElementById("collectionTable").classList.toggle("hidden", panel !== "collection");

    const heading = document.getElementById("panelHeading");
    heading.textContent = panel === "equipment" ? "Equipment" : "Collection Schedule";
    heading.classList.remove("hidden");
}

function selectManagerPanel(panel){

    if(!requireRole("manager")) {
        return;
    }

    const isBorrowers = panel === "borrowers";

    document.getElementById("borrowersBtn").classList.toggle("selected", isBorrowers);
    document.getElementById("techniciansBtn").classList.toggle("selected", !isBorrowers);

    document.getElementById("borrowersTable").classList.toggle("hidden", !isBorrowers);
    document.getElementById("techniciansTable").classList.toggle("hidden", isBorrowers);

    const heading = document.getElementById("managerHeading");
    heading.textContent = isBorrowers ? "Borrowers" : "Technicians";
    heading.classList.remove("hidden");

    const newButton = document.getElementById("newUserButton");
    newButton.textContent = isBorrowers ? "New Borrower" : "New Technician";
    newButton.classList.remove("hidden");
}

function checkLogin(requiredRole){
    return currentUser !== null && currentUser.role === requiredRole;
}

function requireRole(requiredRole){
    if(!valid_Roles.includes(requiredRole)){
        currentUser = null;
        showView("welcomeView");
        return false;
    }

    if(checkLogin(requiredRole)){
        return true;
    }

    currentUser=null;
    showView(requiredRole + "LoginView");
    setMessage(requiredRole + "Error", "Please sign in for this role");
    return false;
}

function openConsole(role){
    if(!requireRole(role)) return;

    document.getElementById(role + "ConsoleUser").textContent =
        currentUser.firstName + " " + currentUser.lastName + "   |   " + currentUser.credential;

    showView(role + "ConsoleView");
}

function signOut(){
    if(currentUser === null){
        showView("welcomeView");
        return;
    }

    const role = currentUser.role;
    currentUser = null;

    document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]')
        .forEach(input => input.value = "");

    clearFormMessages();
    showView(role + "LoginView");
}

function startApp(){
    loadData();
    currentUser = null;
    showView("welcomeView");
}