/* Parts 2 and 3. L and G/R gaps are guided. T3-T5 are independent tasks. */
const SESSION_KEY = "wslab2.session";
const COOKIE_NAME = "WorkshopAccessID";
let currentUser = null;
function recognisedRole(kind) { return kind === "learner" || kind === "coach" || kind === "coordinator"; }
function recordId(record, kind) { return kind === "learner" ? record.memberCode : record.staffCode; }
function recordCredential(record, kind) { return kind === "learner" ? record.memberCode : record.email.toLowerCase(); }
function readSession() {
    const text = sessionStorage.getItem(SESSION_KEY);
    return text === null ? null : JSON.parse(text);
}
function rememberUser(record, kind) {
    const session = {role: kind, id: recordId(record, kind), credential: recordCredential(record, kind),
        firstName: record.firstName, lastName: record.lastName,
        // T3a: replace 0 with Date.now() plus five minutes in milliseconds.
        expiresAt: Date.now()+300000};
    // T3b: write this session as JSON under SESSION_KEY in sessionStorage.
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    currentUser = session;
}
function createCookie(id) {
    // T4a: set COOKIE_NAME to id, with Max-Age=300; Path=/; SameSite=Lax.
    document.cookie = COOKIE_NAME + "=" + id + "; Max-Age=300; Path=/; SameSite=Lax";
}
function removeCookie() {
    // T4b: delete COOKIE_NAME with an empty value, Max-Age=0 and Path=/.
    document.cookie = COOKIE_NAME + "=; Max-Age=0; Path=/"; 
}
// Supplied classroom input checks. These are not Lab 1 registration validators.
function loginInputError(details, kind) {
    if (typeof details.credential !== "string" || details.credential === "") return "Enter your member code or email";
    if (typeof details.password !== "string" || details.password.length < 8) return "Enter a classroom password of at least eight characters";
    if (kind === "learner") {
        if (details.credential.length !== 4 || details.credential[0] !== "W") return "Use W followed by three digits";
        for (let i = 1; i < 4; i++) if (!"0123456789".includes(details.credential[i])) return "Use W followed by three digits";
    } else {
        const parts = details.credential.toLowerCase().split("@");
        if (parts.length !== 2 || parts[0] === "" || parts[1] !== "example.org" || details.credential.includes(" ")) return "Use your fictional example.org email";
    }
    return "";
}
async function signIn(details, kind) {
    if (!recognisedRole(kind)) kind = "learner"; // supplied default-role rule
    sessionStorage.removeItem(SESSION_KEY); currentUser = null; removeCookie();
    const error = loginInputError(details, kind);
    if (error !== "") return error;
    try {
        // L1: await loadAccounts(kind) before reading the stored array.
        await loadAccounts(kind);
        const rows = readArray(kind);
        const entered = kind === "learner" ? details.credential : details.credential.toLowerCase();
        for (let i = 0; i < rows.length; i++) {
            const record = rows[i];
            // L2: replace false with BOTH comparisons on this record: credential and password.
            if (recordCredential(record, kind) === entered && record.password === details.password) {
                rememberUser(record, kind); createCookie(recordId(record, kind));
                return "";
            }
        }
        return "Those details do not match one workshop account";
    } catch (error) { return "Could not load workshop data. Please retry."; }
}
function restoreAccess() {
    const session = readSession();
    if (session === null) { showView("welcomeView"); return; }
    if (!recognisedRole(session.role)) { sessionStorage.removeItem(SESSION_KEY); currentUser = null; showView("welcomeView"); return; }
    // R1: replace true with the condition that the expiry time has been reached.
    if (Date.now() >= session.expiresAt) { 
        sessionStorage.removeItem(SESSION_KEY); currentUser = null; removeCookie();
        showLogin(session.role); setNotice("Your five minutes have ended. Sign in again."); return;
    }
    currentUser = session;
    // R2: show this session's console by calling openConsole with its role.
    openConsole(session.role); 
}
function requireAccess(required) {
    if (!recognisedRole(required)) { showView("welcomeView"); return false; }
    const session = readSession();
    if (session === null) { currentUser = null; showLogin(required); return false; }
    // G1: replace false with the condition that the expiry time has been reached.
    if (Date.now() >= session.expiresAt) {   
        sessionStorage.removeItem(SESSION_KEY); currentUser = null; removeCookie();
        showLogin(required); setNotice("Your five minutes have ended. Sign in again."); return false;
    }
    // G2: replace false with a check for an unrecognised session role OR a role mismatch.
    if (!recognisedRole(session.role) || session.role !== required) { showLogin(required); return false; }
    currentUser = session;
    return true;
}
function signOut() {
    const session = readSession();
    const kind = session !== null && recognisedRole(session.role) ? session.role : "learner";
    // T5: remove SESSION_KEY from sessionStorage and call removeCookie(). Keep ACCOUNT_KEYS.
    sessionStorage.removeItem(SESSION_KEY);                      
    removeCookie();

    currentUser = null; clearUserInputs(); showLogin(kind); setNotice("You have signed out.");
}
async function recoverStaff(email, kind) {
    if (kind !== "coach" && kind !== "coordinator") return "Choose a staff role";
    if (email.trim() === "") return "Enter a fictional staff email";
    try {
        // K1: await loadAccounts(kind) before searching.
        await loadAccounts(kind);
        const rows = readArray(kind);
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].email.toLowerCase() === email.toLowerCase()) return "Recovery request noted for this classroom example. No email was sent.";
        }
        return "No matching staff email";
    } catch (error) { return "Could not load workshop data. Please retry."; }
}
