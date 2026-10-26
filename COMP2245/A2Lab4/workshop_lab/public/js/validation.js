/* All checks use ordinary strings, loops and conditions; no regular expressions.
   Supplied functions are examples to read. Complete V1 and V2. */
function isWord(value) {
    if (value.length === 0) return false;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < value.length; i++) {
        if (!letters.includes(value[i])) return false;
    }
    return true;
}

function isLabEmail(value) {
    value = value.toLowerCase();
    const pieces = value.split("@");
    if (pieces.length !== 2 || pieces[0] === "" || pieces[1] !== "example.org") return false;
    const allowed = "abcdefghijklmnopqrstuvwxyz0123456789._-";
    for (let i = 0; i < pieces[0].length; i++) {
        if (!allowed.includes(pieces[0][i])) return false;
    }
    return true;
}

function isLabCode(code, type) {
    if (type !== "newcomer" && type !== "returning") throw new Error("Unknown participant type");
    const prefix = type === "newcomer" ? "N" : "R";
    if (code.length !== 5 || code[0] !== prefix) return false;
    for (let i = 1; i < code.length; i++) {
        if (!"0123456789".includes(code[i])) return false;
    }
    return true;
}

function isPhrase(phrase, confirmation = "", confirm = false) {
    if (phrase.length < 8) return false;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const allowed = uppercase + "abcdefghijklmnopqrstuvwxyz" + digits + "!*";
    let hasUpper = false, hasDigit = false, hasSpecial = false;
    for (let i = 0; i < phrase.length; i++) {
        const character = phrase[i];
        if (!allowed.includes(character)) return false;
        if (uppercase.includes(character)) hasUpper = true;
        if (digits.includes(character)) hasDigit = true;
        if ("!*".includes(character)) hasSpecial = true;
    }
    if (!hasUpper || !hasDigit || !hasSpecial) return false;
    if (confirm) {
        // V1: compare the phrase and confirmation exactly, then return that Boolean.
        return false;
    }
    return true;
}

function isNote(note, allowEmpty = false) {
    // V2: if allowEmpty is true and note.trim() is empty, return true here.
    if (note.trim() === "") return false;
    const allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    for (let i = 0; i < note.length; i++) {
        if (!allowed.includes(note[i])) return false;
    }
    return true;
}

// Supplied date example: orientation must be a real calendar date, today or earlier.
// The assignment's twelve-month eligibility rule will require a different comparison.
function orientationCompleted(value) {
    const pieces = value.split("-");
    if (pieces.length !== 3 || pieces[0].length !== 4 || pieces[1].length !== 2 || pieces[2].length !== 2) return false;
    for (let p = 0; p < pieces.length; p++) {
        for (let i = 0; i < pieces[p].length; i++) {
            if (!"0123456789".includes(pieces[p][i])) return false;
        }
    }
    const year = Number(pieces[0]), month = Number(pieces[1]), day = Number(pieces[2]);
    const entered = new Date(year, month - 1, day);
    if (entered.getFullYear() !== year || entered.getMonth() !== month - 1 || entered.getDate() !== day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entered.getTime() <= today.getTime();
}

function isCollectionPoint(value) { return value === "east" || value === "west"; }
