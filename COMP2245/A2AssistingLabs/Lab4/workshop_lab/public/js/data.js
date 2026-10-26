/* Complete D1, D2, D3 and P1. The service URLs are relative to public/index.html. */
async function readJSON(url) {
    const response = await fetch(url);
    // D1a: if response.ok is false, throw new Error("Could not load data").
    if(!response.ok) throw new Error("Could not load data");

    // D1b: await response.json() and return the resulting value.
    return await response.json();
}

// Supplied helper: returns a select element as an HTML string.
function selectMarkup(name, id, rows) {
    const select = document.createElement("select");
    select.name = name;
    select.id = id;
    const prompt = document.createElement("option");
    prompt.value = "";
    prompt.textContent = "Choose one";
    select.appendChild(prompt);
    for (let i = 0; i < rows.length; i++) {
        const option = document.createElement("option");
        // D2: set option.value to rows[i].code and option.textContent to rows[i].name.
        option.value = rows[i].code;
        option.textContent = rows[i].name;

        select.appendChild(option);
    }
    return select.outerHTML;
}

async function loadFormOptions(type) {
    if (type !== "newcomer" && type !== "returning") throw new Error("Unknown participant type");
    const locations = await readJSON("data/locations.json");
    const tracksByType = await readJSON("data/tracks.json");
    // These checks keep a bad response from producing a misleading dropdown.
    if (!Array.isArray(locations) || !Array.isArray(tracksByType[type])) throw new Error("Complete D1 before loading options");
    return {locations: locations, tracks: tracksByType[type]};
}

function codeIsUsed(code, rows) {
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].bookingCode === code) return true;
    }
    return false;
}

async function makeBookingCode(type) {
    if (type !== "newcomer" && type !== "returning") throw new Error("Unknown participant type");
    const rows = await readJSON("api/bookings.php");
    if (!Array.isArray(rows)) throw new Error("Expected a booking array");
    const prefix = type === "newcomer" ? "N" : "R";
    let code;
    do {
        code = prefix + String(1000 + Math.floor(Math.random() * 9000));
        // D3: replace false with the codeIsUsed check for this code and rows.
    } while (codeIsUsed(code, rows));
    return code;
}

async function sendBooking(form) {
    const body = new URLSearchParams(new FormData(form));
    // P1a: remove confirmPhrase from body with its delete method.
    body.delete("confirmPhrase");

    // P1b: use fetch(form.action, { method: form.method, body: body }) and await it.
    const response = await fetch(form.action, { method: form.method, body: body});
    
    // Replace the next line with that request and store its result in response.
    
    const result = await response.json();
    if (response.status !== 201 || result.ok !== true) {
        const error = new Error(result.message || "Could not save booking");
        error.field = result.field || "";
        throw error;
    }
    return result;
}
