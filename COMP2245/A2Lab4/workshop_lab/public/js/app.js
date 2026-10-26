/* Complete E1-E4 and V3. The other application code is supplied and explained. */
const form = document.getElementById("bookingForm");
let availableLocations = [], availableTracks = [];

function initialize() {
    // E1: attach openBookingForm to the New booking button's click event.
    // E2: attach cancelBooking to the Cancel button's click event.
    // E3: attach generateBookingCode to the Generate button's click event.
    // E4: attach handleSubmit to the form's submit event.
    // Supplied: type changes reload the matching tracks and clear the old ID.
    document.getElementById("participantType").addEventListener("change", changeType);
    refreshPreview();
}
// Attach handlers once, when the document has been read. Do not attach them in showView.
document.addEventListener("DOMContentLoaded", initialize);

function setStatus(message) { document.getElementById("status").textContent = message; }
function showView(id) {
    document.getElementById("welcomeView").hidden = id !== "welcomeView";
    document.getElementById("bookingView").hidden = id !== "bookingView";
}
function coordinatorAllowed() {
    if (document.getElementById("coordinator").checked) return true;
    setStatus("Select Coordinator mode before opening or changing a booking.");
    showView("welcomeView");
    return false;
}
async function openBookingForm() {
    if (!coordinatorAllowed()) return;
    showView("bookingView");
    await changeType();
}
async function changeType() {
    if (!coordinatorAllowed()) return;
    document.getElementById("bookingCode").value = "";
    clearErrors();
    const message = document.getElementById("formMessage");
    message.textContent = "Loading form options. Please wait...";
    availableLocations = []; availableTracks = [];
    document.getElementById("locationControl").innerHTML = selectMarkup("locationCode", "locationCode", []);
    document.getElementById("trackControl").innerHTML = selectMarkup("trackCode", "trackCode", []);
    try {
        const options = await loadFormOptions(form.elements.participantType.value);
        availableLocations = options.locations; availableTracks = options.tracks;
        document.getElementById("locationControl").innerHTML = selectMarkup("locationCode", "locationCode", availableLocations);
        document.getElementById("trackControl").innerHTML = selectMarkup("trackCode", "trackCode", availableTracks);
        message.textContent = "";
    } catch (error) { message.textContent = error.message; }
}
async function generateBookingCode() {
    if (!coordinatorAllowed()) return;
    const button = document.getElementById("generateCode");
    button.disabled = true;
    document.getElementById("formMessage").textContent = "Generating code. Please wait...";
    try {
        const code = await makeBookingCode(form.elements.participantType.value);
        form.elements.bookingCode.value = code;
        document.getElementById("formMessage").textContent = "";
    } catch (error) { document.getElementById("formMessage").textContent = error.message; }
    finally { button.disabled = false; }
}
function cancelBooking() {
    form.reset(); clearErrors();
    document.getElementById("formMessage").textContent = "";
    showView("welcomeView");
    setStatus("Booking cancelled. No record was sent.");
}
function showError(name, message) {
    document.getElementById(name + "Error").textContent = message;
    const target = name === "collectionPoint" ? document.getElementById("collectionGroup") : document.getElementById(name);
    target.classList.add("invalid");
}
function clearErrors() {
    document.querySelectorAll(".error").forEach(function (item) { item.textContent = ""; });
    document.querySelectorAll(".invalid").forEach(function (item) { item.classList.remove("invalid"); });
}
function selectedCodeExists(code, rows) {
    for (let i = 0; i < rows.length; i++) if (rows[i].code === code) return true;
    return false;
}
function validateForm() {
    clearErrors();
    let valid = true;
    function check(name, accepted, message) {
        if (!accepted) { showError(name, message); valid = false; }
    }
    const fields = Object.fromEntries(new FormData(form)); // supplied way to read named controls
    const required = ["bookingCode", "displayName", "email", "passphrase", "confirmPhrase", "orientationDate", "locationCode", "trackCode", "collectionPoint"];
    for (let i = 0; i < required.length; i++) {
        const name = required[i];
        if (!fields[name] || fields[name].trim() === "") check(name, false, "Please fill in this field");
    }
    // Missing fields have already been reported; avoid replacing their messages.
    if (!valid) return false;
    check("bookingCode", isLabCode(fields.bookingCode, fields.participantType), "Generate a code for this participant type");
    // V3: call check for displayName using isWord(fields.displayName) and "Use letters only".
    check("email", isLabEmail(fields.email), "Use a fictional @example.org email");
    check("passphrase", isPhrase(fields.passphrase), "Use 8 or more characters with an uppercase letter, digit and ! or *");
    check("confirmPhrase", isPhrase(fields.passphrase, fields.confirmPhrase, true), "Confirmation must match a valid passphrase");
    check("deliveryNote", isNote(fields.deliveryNote, true), "Use letters, digits and spaces only");
    check("orientationDate", orientationCompleted(fields.orientationDate), "Use a real date that is today or earlier");
    check("locationCode", selectedCodeExists(fields.locationCode, availableLocations), "Choose a listed location");
    check("trackCode", selectedCodeExists(fields.trackCode, availableTracks), "Choose a track for this participant type");
    check("collectionPoint", isCollectionPoint(fields.collectionPoint), "Choose East desk or West desk");
    return valid;
}
async function handleSubmit(event) {
    event.preventDefault(); // stops the browser from leaving this page
    if (!coordinatorAllowed() || !validateForm()) return;
    const button = document.getElementById("bookButton");
    button.disabled = true;
    document.getElementById("formMessage").textContent = "Saving booking. Please wait...";
    try {
        const result = await sendBooking(form);
        form.reset(); clearErrors();
        document.getElementById("formMessage").textContent = "";
        showView("welcomeView");
        setStatus("Booking saved: " + result.record.bookingCode);
        await refreshPreview(); // this helper reports its own loading failure separately
    } catch (error) {
        document.getElementById("formMessage").textContent = error.message;
        if (error.field && document.getElementById(error.field + "Error")) showError(error.field, error.message);
    } finally { button.disabled = false; }
}
async function refreshPreview() {
    const rows = document.getElementById("bookingRows");
    try {
        const records = await readJSON("api/bookings.php");
        if (!Array.isArray(records)) throw new Error("Expected a booking array");
        rows.replaceChildren();
        for (let i = 0; i < records.length; i++) {
            const tr = document.createElement("tr");
            for (const key of ["bookingCode", "displayName", "participantType", "trackCode", "locationCode"]) {
                const td = document.createElement("td"); td.textContent = records[i][key]; tr.appendChild(td);
            }
            rows.appendChild(tr);
        }
    } catch (error) {
        const previous = document.getElementById("status").textContent;
        const saved = previous.startsWith("Booking saved:") ? previous + ". " : "";
        setStatus(saved + "Table could not load. " + error.message);
    }
}
