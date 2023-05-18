// Page DOM elements
const dashboardPage = document.getElementById("dashboard-page");
const tutorPage = document.getElementById("tutor-page");
const studentPage = document.getElementById("student-page");
const aboutPage = document.getElementById("about-page");
const addTutorPage = document.getElementById("add-tutor-page");
const findTutorPage = document.getElementById("find-tutor-page");
const addStudentPage = document.getElementById("add-student-page");
const findStudentPage = document.getElementById("find-student-page");
const editTutorPage = document.getElementById("edit-tutor-page");

// Button DOM elements (page)
const dashboardButton = document.getElementById("dashboard");
const tutorManagementButton = document.getElementById("manage-tutors");
const studentManagementButton = document.getElementById("manage-students");
const aboutButton = document.getElementById("about");
const title = document.getElementById("top-bar-title");
const editTutorButton = document.getElementById("edit-tutor");
const editStudentButton = document.getElementById("edit-student");

// Tutor Page DOM Elements
var addTutorButton = document.getElementById("add-tutor-button")
var findTutorButton = document.getElementById("find-tutor-button")

// Student Page DOM Elements
var addStudentButton = document.getElementById("add-student-button")
var findStudentButton = document.getElementById("find-student-button")
var newSegmentButton = document.getElementById("new-time-segment")

// Back Elements
var backAddTutor = document.getElementById("back-add-tutor-page")
var backFindTutor = document.getElementById("back-find-tutor-page")
var backAddStudent = document.getElementById("back-add-student-page")
var backFindStudent = document.getElementById("back-find-student-page")

// Alerters
var addTutorAlerter = document.querySelector('.add-tutor-alert')
var addStudentAlerter = document.querySelector('.add-student-alert')

// Used to add database elements
var tutorTable = document.getElementById("tutor-table")
var studentTable = document.getElementById("student-table")
var tutorSelection = document.getElementById("select-tutors")

var refreshStudents = document.getElementById('refresh-students-button')
var refreshTutors = document.getElementById('refresh-tutors-button')

refreshStudents.onclick = function() { 
    ipcRenderer.send('refresh-tutors');
    ipcRenderer.send('refresh-students');
}
refreshTutors.onclick = function() { 
    ipcRenderer.send('refresh-tutors');
    ipcRenderer.send('refresh-students');
}

// Render database elements
ipcRenderer.send('refresh-tutors');
ipcRenderer.send('refresh-students');

// if row is clicked, open the modal
const tutorModal = document.getElementById("tutor-modal");
const studentModal = document.getElementById("student-modal");
const tutorModalExit = document.getElementsByClassName("close-modal")[0];
const studentModalExit = document.getElementsByClassName("close-modal")[1];

const deleteTutor = document.getElementById("delete-tutor");
const deleteStudent = document.getElementById("delete-student");

var tutorEditID = ""
var tutorEditBool = false;

var studentEditID = ""
var studentEditBool = false;

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const tutorTableListener = (data) => {
    tutorModal.style.display = "block";
    tutorModal.querySelector('#tutor-name-modal').innerHTML = " " + data.name;
    tutorModal.querySelector('#tutor-date-modal').innerHTML = " " + monthNames[data.createdAt.getMonth()] 
    + " " + data.createdAt.getDate() + " " + data.createdAt.getFullYear();
    tutorModal.querySelector('#tutor-email-modal').innerHTML = " " + checkNull(data.email);
    tutorModal.querySelector('#tutor-number-modal').innerHTML = " " + checkNull(data.phone_number);

    subjects = data.subjects
    str = "";
    for (var j = 0; j < subjects.length; j++) {
        str += subjects[j];
        if (j < subjects.length - 1) {
            str += ", ";
        }
    };

    tutorModal.querySelector('#tutor-subjects-modal').innerHTML = " " + str;
    tutorModal.querySelector('#tutor-location-modal').innerHTML = " " + data.location_status;

    tutorModal.querySelector('#tutor-monday-info').innerHTML = " " + convertTime(data.mon);
    tutorModal.querySelector('#tutor-tuesday-info').innerHTML = " " + convertTime(data.tues);
    tutorModal.querySelector('#tutor-wednesday-info').innerHTML = " " + convertTime(data.wed);
    tutorModal.querySelector('#tutor-thursday-info').innerHTML = " " + convertTime(data.thurs);
    tutorModal.querySelector('#tutor-friday-info').innerHTML = " " + convertTime(data.fri);
    tutorModal.querySelector('#tutor-saturday-info').innerHTML = " " + convertTime(data.sat);
    tutorModal.querySelector('#tutor-sunday-info').innerHTML = " " + convertTime(data.sun);
    tutorModal.querySelector('#tutor-other-info').innerHTML = " " + (data.other_info.trim().length !== 0 ? data.other_info : "None");   
    
    students = data.student_names
    str = "";
    if (JSON.stringify(students) !== '[]') {
        for (var j = 0; j < students.length; j++) {
            str += students[j];
            if (j < students.length - 1) {
                str += ", ";
            }
        };
    }
    else {
        str = "None"
    }
    tutorModal.querySelector('#tutor-student-list').innerHTML = " " + str;
}

// Modal functionality
tutorTable.addEventListener('click', function(event) {
    tutorEditID = event.target.id;
    // remove event listener after use
    if (tutorEditID !== ('tutor-details')) {
        ipcRenderer.send('get-tutor-info', tutorEditID);
        ipcRenderer.on('tutor-info-response', tutorTableListener)
    }
    deleteTutor.addEventListener('click', function(subEvent) {
        ipcRenderer.send('remove-tutor', tutorEditID);
        setTimeout(function() {
            // Code to be executed after one second
            ipcRenderer.send('refresh-tutors');
            ipcRenderer.send('refresh-students');
            tutorModal.style.display = "none";
        }, 600);
    });
});

editTutorButton.onclick = function() {
    tutorEditBool = true;
    changePage("Edit Tutor", addTutorPage);
    ipcRenderer.send('get-tutor-info', tutorEditID);
    ipcRenderer.on('tutor-info-response', (data) => {
        tutorName.value = data.name;
        tutorEmail.value = data.email;
        tutorNumber.value = data.phone_number;
        for (option of tutorSubjects) {
            if (data.subjects.includes(option.value)) {
                option.selected = true;
            }
        }
        for (option of locationStatus) {
            if (data.location_status === option.value) {
                option.selected = true;
            }
        }
        otherInfo.value = data.other_info;
    });
}

studentTable.addEventListener('click', function(event) {
    studentEditID = event.target.id;
    if (studentEditID !== ('student-details')) {
        ipcRenderer.send('get-student-info', studentEditID);
        ipcRenderer.on('student-info-response', (data) => {
            studentModal.style.display = "block";
            studentModal.querySelector('#student-name-modal').innerHTML = " " + data.name;
            studentModal.querySelector('#student-date-modal').innerHTML = " " + monthNames[data.createdAt.getMonth()] 
            + " " + data.createdAt.getDate() + " " + data.createdAt.getFullYear();
            studentModal.querySelector('#student-number-modal').innerHTML = " " + checkNull(data.phone_number);
            studentModal.querySelector('#parent-name-modal').innerHTML = " " + data.parent_name;
            studentModal.querySelector('#parent-email-modal').innerHTML = " " + checkNull(data.parent_email);
            studentModal.querySelector('#parent-number-modal').innerHTML = " " + checkNull(data.parent_number);
            studentModal.querySelector('#student-subjects-modal').innerHTML = " " + data.subjects;
            studentModal.querySelector('#student-location-modal').innerHTML = " " + convertLocation(data.location_status);

            studentModal.querySelector('#student-monday-info').innerHTML = " " + convertTime(data.mon);
            studentModal.querySelector('#student-tuesday-info').innerHTML = " " + convertTime(data.tues);
            studentModal.querySelector('#student-wednesday-info').innerHTML = " " + convertTime(data.wed);
            studentModal.querySelector('#student-thursday-info').innerHTML = " " + convertTime(data.thurs);
            studentModal.querySelector('#student-friday-info').innerHTML = " " + convertTime(data.fri);
            studentModal.querySelector('#student-saturday-info').innerHTML = " " + convertTime(data.sat);
            studentModal.querySelector('#student-sunday-info').innerHTML = " " + convertTime(data.sun);

            studentModal.querySelector('#student-other-info').innerHTML = " " + (data.other_info.trim().length !== 0 ? data.other_info : "None");
            studentModal.querySelector('#student-tutor').innerHTML = " " + (data.tutor_name ? data.tutor_name : "None");      
        });
        deleteStudent.addEventListener('click', function(subEvent) {
            ipcRenderer.send('remove-student', studentEditID);
            setTimeout(function() {
                // Code to be executed after one second
                ipcRenderer.send('refresh-students');
                ipcRenderer.send('refresh-tutors');
                studentModal.style.display = "none";
            }, 600);
        });
    }
});

editStudentButton.onclick = function() {
    studentEditBool = true;
    changePage("Edit Student", addStudentPage);
    ipcRenderer.send('get-student-info', studentEditID);
    ipcRenderer.on('student-info-response', (data) => {
        studentName.value = data.name;
        studentNumber.value = data.phone_number;
        parentName.value = data.parent_name;
        parentEmail.value = data.parent_email;
        parentNumber.value = data.parent_number
        for (option of studentSubjects) {
            if (data.subjects.includes(option.value)) {
                option.selected = true;
            }
        }
        for (option of studentLocationStatus) {
            if (data.location_status === option.value) {
                option.selected = true;
            }
        }
        otherStudentInfo.value = data.other_info;

        for (option of tutorSelection) {
            if (data.tutor_name + " " + data.tutor_id === option.value) {
                option.selected = true;
            }
        }
    });
}

tutorModalExit.onclick = function() {
    ipcRenderer.removeAll('tutor-info-response');
    tutorModal.style.display = "none";
}

studentModalExit.onclick = function() {
    ipcRenderer.removeAll('student-info-response');
    studentModal.style.display = "none";
}

document.getElementById("tutor-phone-number").addEventListener('input', (event) => {
    // Get the current value of the input field
    let value = event.target.value;

    // Use a regular expression to add spaces or dashes after every 2nd or 3rd character
    value = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    value = (!value[2]) ? value[1] : value[1] + '-' + value[2] + (value[3] ? '-' + value[3] : '');

    // Update the value of the input field
    event.target.value = value;
});

document.getElementById("student-phone-number").addEventListener('input', (event) => {
    // Get the current value of the input field
    let value = event.target.value;

    // Use a regular expression to add spaces or dashes after every 2nd or 3rd character
    value = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    value = (!value[2]) ? value[1] : value[1] + '-' + value[2] + (value[3] ? '-' + value[3] : '');

    // Update the value of the input field
    event.target.value = value;
});

document.getElementById("parent-phone-number").addEventListener('input', (event) => {
    // Get the current value of the input field
    let value = event.target.value;

    // Use a regular expression to add spaces or dashes after every 2nd or 3rd character
    value = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    value = (!value[2]) ? value[1] : value[1] + '-' + value[2] + (value[3] ? '-' + value[3] : '');

    // Update the value of the input field
    event.target.value = value;
});

// Formatting functions
function convertLocation(locString) {
    if (locString === "Both"){
        locString = "In Person and/or Remote"
    }
    return locString;
}

function checkNull(val) {
    if (val === "N/A") {
        return "None"
    }
    return val;
}

function convertTime(timeString) {
    let str = timeString.split(", ")

    if (!timeString) {
        return "None";
    }
    for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
            str.splice(i);
        }
        if (str[i] === "") {
            str.splice(i);
        }
    }
    newStr = ""
    for (let i = 0; i < str.length; i++) {
        s = str[i].split(" ");
        if (parseInt(s[0]) === parseFloat(s[0])) {
            s[0] += ":00"
        }
        else {
            s[0] -= ".5"
            s[0] += ":30"
        }
        if (parseInt(s[3]) === parseFloat(s[3])) {
            s[3] += ":00"
        }
        else {
            s[3] -= ".5"
            s[3] += ":30"
        }
        s[1] = s[1].toUpperCase();
        s[4] = s[4].toUpperCase();
        s = s[0] + " " + s[1] + " " + s[2] + " " + s[3] + " " +  s[4]
        newStr += s
        if (i < (str.length - 1)) {
            newStr += ", "
        }
    }

    return newStr;
}

// page changing functions
function removeCurrentPage() {
    dashboardPage.style.display = "none";
    tutorPage.style.display = "none";
    studentPage.style.display = "none";
    aboutPage.style.display = "none";
    addTutorPage.style.display = "none";
    findTutorPage.style.display = "none";
    addStudentPage.style.display = "none";
    findStudentPage.style.display = "none";
    editTutorPage.style.display = "none";
    tutorModal.style.display = "none";
    studentModal.style.display = "none";
}

function changePage(text, pageEvent) {
    removeCurrentPage();
    title.innerHTML = text;
    pageEvent.style.display = "block";
}

// removes error
function removeError(alertObject) {alertObject.style.display = 'none';}

// on click handlers
addTutorButton.onclick = function() {
    tutorEditBool = false;
    changePage("Add Tutor", addTutorPage);
}

backAddTutor.onclick = function() {
    ipcRenderer.removeAll('tutor-info-response');
    changePage("Manage Tutors", tutorPage);
    addTutorPage.querySelector('form').reset();
    removeError(addTutorAlerter);
}

findStudentButton.onclick = function() { changePage("Find Student", findStudentPage);}
backFindStudent.onclick = function(){ changePage("Manage Students", studentPage);}

addStudentButton.onclick = function() { 
    tutorStudentBool = false;
    changePage("Add Student", addStudentPage);
}
backAddStudent.onclick = function(){
    ipcRenderer.removeAll('student-info-response');
    changePage("Manage Students", studentPage);
    addStudentPage.querySelector('form').reset();
    removeError(addStudentAlerter);
}

dashboardButton.onclick = function(){ 
    changePage("Dashboard", dashboardPage);
}

tutorManagementButton.onclick = function(){ 
    changePage("Manage Tutors", tutorPage);
}

studentManagementButton.onclick = function(){
    changePage("Manage Students", studentPage);
}

aboutButton.onclick = function(){
    editTutorPage.style.display = "none";
    changePage("About", aboutPage);
}

// data rendering
ipcRenderer.on('tutor-database-response', (data) => {
    // get children of parent then delete
    let trElements = tutorTable.querySelectorAll("tr");
    for (let i = 0; i < trElements.length; i++) {
        if (trElements[i].id !== "tutor-details") {
            trElements[i].remove(); 
        }
    }

    let opElements = tutorSelection.querySelectorAll("option");
    for (let i = 0; i < opElements.length; i++) {
        if (opElements[i].innerHTML !== "None") {
            opElements[i].remove(); 
        }
    }
    
    if (data) {
        document.getElementById("tutor-number-stat").innerHTML = data.length;

        numNewTutors = 0;
        numStudents = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].createdAt.getTime() > (Date.now() - (24 * 60 * 60 * 1000))) {
                numNewTutors++;
            }
            if (data[i].student_names.length > 0) {
                numStudents++;
            }
        };
        document.getElementById("new-tutor-number-stat").innerHTML = numNewTutors;
        document.getElementById("tutor-with-student-number-stat").innerHTML = numStudents;
        document.getElementById("tutor-without-student-number-stat").innerHTML = data.length - numStudents;
        
        for (var i = 0; i < data.length; i++) {
            var tutorRow = document.createElement('tr');

            const tutorName = document.createElement('th');
            tutorName.innerHTML = data[i].name;
            tutorName.id = data[i]._id;
            tutorRow.appendChild(tutorName);

            const tutorSubjects = document.createElement('th');
            tutorSubjects.id = data[i]._id;

            subjects = data[i].subjects
            str = "";
            for (let j = 0; j < subjects.length; j++) {
                str += subjects[j];
                if (j < subjects.length - 1) {
                    str += ", "
                }
            }

            tutorSubjects.innerHTML = str;
            tutorRow.appendChild(tutorSubjects);

            const students = document.createElement('th');
            students.id = data[i]._id;
            str = "";
            tutorStudents = data[i].student_names;
            for (let j = 0; j < tutorStudents.length; j++) {
                str += tutorStudents[j] + ", ";
            }
            students.innerHTML = str;
            tutorRow.appendChild(students);

            tutorRow.classList.add('tutor-row');
            tutorRow.id = data[i]._id;
            tutorTable.appendChild(tutorRow);

            const newOption = document.createElement('option');
            newOption.innerHTML = tutorName.innerHTML;
            newOption.value = tutorName.innerHTML + " " + data[i]._id;
            tutorSelection.append(newOption);
        }
    }
});

ipcRenderer.on('student-database-response', (data) => {
    // get children of parent then delete
    let trElements = studentTable.querySelectorAll("tr");
    for (let i = 0; i < trElements.length; i++) {
        if (trElements[i].id !== "student-details") {
            trElements[i].remove(); 
        }
    }
    if (data) {
        document.getElementById("student-number-stat").innerHTML = data.length;

        numNewStudents = 0;
        numTutors = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].createdAt.getTime() > (Date.now() - (24 * 60 * 60 * 1000))) {
                numNewStudents++;
            }
            if (data[i].tutor_name.length > 0) {
                numTutors++;
            }
        }
        document.getElementById("new-student-number-stat").innerHTML = numNewStudents;
        document.getElementById("student-with-tutor-number-stat").innerHTML = numTutors;
        document.getElementById("student-without-tutor-number-stat").innerHTML = data.length - numTutors;

        for (var i = 0; i < data.length; i++) {
            var studentRow = document.createElement('tr');

            const studentName = document.createElement('th');
            studentName.innerHTML = data[i].name;
            studentName.id = data[i]._id;
            studentRow.appendChild(studentName);

            const parentName = document.createElement('th');
            parentName.innerHTML = data[i].parent_name;
            parentName.id = data[i]._id;
            studentRow.appendChild(parentName);

            const studentSubjects = document.createElement('th');
            
            subjects = data[i].subjects
            str = "";
            for (var j = 0; j < subjects.length; j++) {
                str += subjects[j];
                if (j < subjects.length - 1) {
                    str += ", ";
                }
            };

            studentSubjects.innerHTML = str;
            studentSubjects.id = data[i]._id;
            studentRow.appendChild(studentSubjects);

            const tutor = document.createElement('th');
            tutor.innerHTML = data[i].tutor_name;
            tutor.id = data[i]._id;
            studentRow.appendChild(tutor);

            studentRow.classList.add('student-row');
            studentRow.id = data[i]._id;
            studentTable.appendChild(studentRow);
        }
    }
});




