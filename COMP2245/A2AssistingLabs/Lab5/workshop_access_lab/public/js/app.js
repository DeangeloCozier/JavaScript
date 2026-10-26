/* Supplied interface wiring. Complete M1-M4 and C1 where labelled.
   No Lab 1 booking, registration-validation, ID-generation or POST solution is included. */
let selectedList = "";
function showView(id) {
    for (const name of ["welcomeView", "loginView", "recoveryView", "learnerView", "coachView", "coordinatorView"]) document.getElementById(name).hidden = name !== id;
}
function setNotice(message) { document.getElementById("notice").textContent = message; }
function updateCredentialLabel() {
    document.getElementById("credentialLabel").textContent = document.getElementById("loginRole").value === "learner" ? "Member code" : "Email";
}
function showLogin(kind) {
    document.getElementById("loginRole").value = kind; updateCredentialLabel();
    document.getElementById("loginPassword").value = ""; document.getElementById("loginError").textContent = "";
    showView("loginView");
}
function clearUserInputs() {
    document.getElementById("loginForm").reset(); document.getElementById("recoveryForm").reset();
    for (const id of ["loginError", "recoveryMessage", "listMessage", "emptyMessage", "notice"]) document.getElementById(id).textContent = "";
    document.getElementById("rosterRows").replaceChildren(); document.getElementById("rosterHead").replaceChildren();
    document.getElementById("listPanel").hidden = true; document.getElementById("loadingPanel").hidden = true; selectedList = "";
}
function openConsole(kind) {
    if (!requireAccess(kind)) return;
    document.querySelectorAll(".greeting").forEach(function (item) { item.textContent = "Hello " + currentUser.firstName + " " + currentUser.lastName; });
    selectedList = ""; document.getElementById("listPanel").hidden = true;
    showView(kind + "View");
}
async function handleLogin(event) {
    event.preventDefault(); const button = document.getElementById("signInButton"); button.disabled = true;
    const message = document.getElementById("loginError"); message.textContent = "Checking workshop details. Please wait...";
    const kind = document.getElementById("loginRole").value;
    const details = {credential: document.getElementById("credential").value, password: document.getElementById("loginPassword").value};
    try {
        const error = await signIn(details, kind); // read: this result must be awaited
        message.textContent = error;
        if (error === "") { document.getElementById("loginForm").reset(); setNotice(""); openConsole(currentUser.role); }
    } finally { button.disabled = false; }
}
function makeHeading(kind) {
    const head = document.getElementById("rosterHead"); head.replaceChildren();
    const tr = document.createElement("tr");
    const names = kind === "learner" ? ["Member code", "First name", "Last name", "Level", "Action"] : ["Staff code", "Email", "First name", "Last name", "Level", "Action"];
    for (const name of names) { const th = document.createElement("th"); th.scope = "col"; th.textContent = name; tr.appendChild(th); }
    head.appendChild(tr);
}
function fillRoster(kind, rows, levels) {
    const body = document.getElementById("rosterRows");
    // M3: clear old body rows with replaceChildren() before adding new rows.
    body.replaceChildren(); 

    for (let i = 0; i < rows.length; i++) {
        const record = rows[i], tr = document.createElement("tr");
        const values = kind === "learner" ? [record.memberCode, record.firstName, record.lastName, levelName(record.levelCode, levels)] : [record.staffCode, record.email, record.firstName, record.lastName, levelName(record.levelCode, levels)];
        for (const value of values) {
            const td = document.createElement("td");
            // M4: assign value to td.textContent. Do not use innerHTML.
            td.textContent = value;
            tr.appendChild(td);
        }
        const actions = document.createElement("td");
        for (const name of ["View", "Edit", "Deactivate"]) {
            const button = document.createElement("button"); button.type = "button"; button.textContent = name;
            button.addEventListener("click", function () { setNotice(name + " is a placeholder. No record changed."); }); actions.appendChild(button);
        }
        tr.appendChild(actions); body.appendChild(tr);
    }
}
async function showRoster(kind) {
    if (!requireAccess("coordinator")) return false;
    if (kind !== "learner" && kind !== "coach") return false;
    selectedList = kind; document.getElementById("listPanel").hidden = false;
    const loading = document.getElementById("loadingPanel"), message = document.getElementById("listMessage"), empty = document.getElementById("emptyMessage");
    loading.textContent = "Loading " + kind + " data. Please wait..."; loading.hidden = false;
    message.textContent = ""; empty.textContent = ""; document.getElementById("rosterRows").replaceChildren(); makeHeading(kind);
    document.getElementById("listHeading").textContent = kind === "learner" ? "Learners" : "Coaches";
    document.getElementById("rosterCaption").textContent = kind === "learner" ? "Workshop learners" : "Workshop coaches";
    document.getElementById("refreshList").disabled = true;
    try {
        const testCase = document.getElementById("listCase").value;
        // M1: replace [] with await requestRoster(kind, testCase).
        const rows = await requestRoster(kind, testCase);
        const levels = await requestLevels(kind);
        // M2: store the successfully returned account array with writeArray(kind, rows).
        writeArray(kind, rows); 
        fillRoster(kind, rows, levels);
        if (rows.length === 0) empty.textContent = "No " + (kind === "learner" ? "learners" : "coaches") + " to display";
        return true;
    } catch (error) { message.textContent = "Could not load the list. Please use Refresh or Retry."; return false; }
    finally { loading.hidden = true; document.getElementById("refreshList").disabled = false; }
}
async function afterExampleCreation() {
    if (!requireAccess("coordinator")) return;
    setNotice("Example creation confirmed. This practice button saves nothing.");
    selectedList = "learner"; // retain the intended list even if its account reload fails
    try {
        // C1: await loadAccounts("learner") and then await showRoster("learner").
        await loadAccounts("learner");                            
        await showRoster("learner");
    } catch (error) {
        document.getElementById("listPanel").hidden = false;
        document.getElementById("listHeading").textContent = "Learners";
        document.getElementById("rosterCaption").textContent = "Workshop learners";
        makeHeading("learner"); document.getElementById("rosterRows").replaceChildren();
        document.getElementById("emptyMessage").textContent = "";
        document.getElementById("listMessage").textContent = "Could not load the updated list. Please use Refresh or Retry.";
    }
}
async function handleRecovery(event) {
    event.preventDefault(); const button = document.getElementById("recoveryButton"); button.disabled = true;
    const message = document.getElementById("recoveryMessage"); message.textContent = "Checking current staff data. Please wait...";
    try { message.textContent = await recoverStaff(document.getElementById("recoveryEmail").value, document.getElementById("recoveryRole").value); }
    finally { button.disabled = false; }
}
function initialize() {
    document.getElementById("openLogin").addEventListener("click", function () { showLogin("learner"); });
    document.getElementById("loginRole").addEventListener("change", updateCredentialLabel);
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("openRecovery").addEventListener("click", function () { showView("recoveryView"); });
    document.getElementById("backToLogin").addEventListener("click", function () { showLogin(document.getElementById("recoveryRole").value); });
    document.getElementById("recoveryForm").addEventListener("submit", handleRecovery);
    document.querySelectorAll(".signOut").forEach(function (button) { button.addEventListener("click", signOut); });
    document.getElementById("showLearners").addEventListener("click", function () { showRoster("learner"); });
    document.getElementById("showCoaches").addEventListener("click", function () { showRoster("coach"); });
    document.getElementById("refreshList").addEventListener("click", function () { if (selectedList !== "") showRoster(selectedList); });
    document.getElementById("practiceCreation").addEventListener("click", afterExampleCreation);
    restoreAccess();
}
document.addEventListener("DOMContentLoaded", initialize);
