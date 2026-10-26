/* Part 1: complete A1-A3 with guidance; complete T1-T2 independently.
   All workshop data is separate from Lab 1 and from the assessed assignment. */
const ACCOUNT_KEYS = {learner: "wslab2.learners", coach: "wslab2.coaches", coordinator: "wslab2.coordinators"};
function accountKey(kind) {
    if (!Object.prototype.hasOwnProperty.call(ACCOUNT_KEYS, kind)) throw new Error("Unknown workshop role");
    return ACCOUNT_KEYS[kind];
}
function writeArray(kind, rows) {
    const key = accountKey(kind);
    // T1: store rows under key with localStorage.setItem and JSON.stringify.
    localStorage.setItem(key, JSON.stringify(rows))

}
function readArray(kind) {
    const key = accountKey(kind);
    // T2: get the stored string. Return [] when it is null; otherwise parse and return it.
    const text = localStorage.getItem(key);
    if(text === null) return [];
    return JSON.parse(text);
}
async function requestArray(url) {
    // A1: replace null with an awaited fetch(url).
    const response = await fetch(url);
    // A2: if response.ok is false, throw new Error("Could not load workshop data. Please retry.").
    if(!response.ok) throw new Error("Could not load workshop data. Please retry.");

    // A3: replace [] with the awaited response.json() result.
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error("Could not load workshop data. Please retry.");
    return rows;
}
async function loadAccounts(kind) {
    accountKey(kind); // reject an unknown role before requesting data
    const rows = await requestArray("api/accounts.php?group=" + kind);
    writeArray(kind, rows); // called only after a successful response and array check
    return rows;
}
async function requestRoster(kind, testCase) {
    if (kind !== "learner" && kind !== "coach") throw new Error("Choose a list role");
    return await requestArray("api/roster.php?group=" + kind + "&case=" + testCase);
}
async function requestLevels(kind) {
    return await requestArray("api/levels.php?group=" + kind);
}
function levelName(code, levels) {
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].code === code) return levels[i].name;
    }
    return code;
}
