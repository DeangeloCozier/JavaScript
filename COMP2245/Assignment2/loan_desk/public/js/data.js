
const borrowerData = `[
    {
        "studentId": "4000000001",
        "firstName": "Asha",
        "lastName": "Clarke",
        "password": "LoanDesk2026@"
    },
    {
        "studentId": "4000000002",
        "firstName": "Noah",
        "lastName": "Browne",
        "password": "LoanDesk2026@"
    }
]`;

const technicianData = `[
    {
        "email": "maya@uwi.edu",
        "firstName": "Maya",
        "lastName": "Lewis",
        "password": "TechDesk2026#"
    },
    {
        "email": "liam@cavehill.uwi.edu",
        "firstName": "Liam",
        "lastName": "Grant",
        "password": "TechDesk2026#"
    }
]`;

const managerData = `[
    {
        "email": "rhea@uwi.edu",
        "firstName": "Rhea",
        "lastName": "King",
        "password": "ManageDesk26$"
    },
    {
        "email": "omar@cavehill.uwi.edu",
        "firstName": "Omar",
        "lastName": "Ward",
        "password": "ManageDesk26$"
    }
]`;

let borrowers = [];
let technicians = [];
let managers = [];

function loadData() {
    borrowers = JSON.parse(borrowerData);
    technicians = JSON.parse(technicianData);
    managers = JSON.parse(managerData);
}