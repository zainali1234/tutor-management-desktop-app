// Add tutor variables
var tutorForm = document.getElementById("add-tutor-form");
var tutorName = document.getElementById("tutor-name");
var tutorEmail = document.getElementById("tutor-email");
var tutorNumber = document.getElementById("tutor-phone-number");
var tutorSubjects = document.getElementById("tutor-subjects");
var locationStatus = document.getElementById("location-status");
var otherInfo = document.getElementById("other-info");
var addTutorAlerter = document.querySelector('.add-tutor-alert')

// Add student variables
var studentForm = document.getElementById("add-student-form");
var studentName = document.getElementById("student-name");
var studentNumber = document.getElementById("student-phone-number");
var parentName = document.getElementById("parent-name");
var parentEmail = document.getElementById("parent-email");
var parentNumber = document.getElementById("parent-phone-number");
var studentSubjects = document.getElementById("student-subjects");
var studentLocationStatus = document.getElementById("student-location-status");
var otherStudentInfo = document.getElementById("student-other-info-text");
var addStudentAlerter = document.querySelector('.add-student-alert')

// Used to add database elements
var tutorTable = document.getElementById("tutor-table")
var studentTable = document.getElementById("student-table")
var tutorSelection = document.getElementById("select-tutors")
var tutorSort = document.getElementById("select-tutor-sort") 

const sharedInfo = document.getElementById("shared-info");
const meetingType = document.getElementById("shared-comm-val")
const sharedSubjects = document.getElementById("shared-subjects-val")

// Rendering elements
const weekArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// Select tutor
const selectTutor = document.getElementById('select-tutors');
const selectTutorButton = document.getElementById('select-tutor-button');

selectTutor.addEventListener("change", function() {
    const formValues = studentFormEntry();
    handleStudentForm(formValues.studentNameValue, formValues.studentNumberValue, formValues.parentNameValue, formValues.parentEmailValue,
        formValues.parentNumberValue, formValues.studentSubjectValues, formValues.studentLocationStatusValue, formValues.studentTimesArray,
        formValues.otherStudentInfoValue, formValues.tutorOptionArr);
});

selectTutorButton.addEventListener("click", function() {
    const formValues = studentFormEntry();
    handleStudentForm(formValues.studentNameValue, formValues.studentNumberValue, formValues.parentNameValue, formValues.parentEmailValue,
        formValues.parentNumberValue, formValues.studentSubjectValues, formValues.studentLocationStatusValue, formValues.studentTimesArray,
        formValues.otherStudentInfoValue, formValues.tutorOptionArr);
});

function handleStudentForm(studentNameValue, studentNumberValue, parentNameValue, parentEmailValue,
    parentNumberValue, studentSubjectValues, studentLocationStatusValue, studentTimesArray,
    otherStudentInfoValue, tutorOptionArr) {

    // Verify student info is inputted first
    if (studentSubjectValues.length === 0 || !validateTime(studentTimesArray)) {
        document.getElementById("shared-err").style.display = 'block';
    }
    else {
        document.getElementById("shared-err").style.display = 'none';
        for (let i = 0; i < studentTimesArray.length; i++) {
            // one time string / /
            newStr = ""
            let arr = studentTimesArray[i].split(" / ");
            for (let i = 0; i < arr.length; i++) {
                chars = arr[i].split(" ");
                if (chars[0] !== chars[3]) {
                    newStr += arr[i];
                    if (i < arr.length - 1) {
                        newStr += ", ";
                    }
                }
            }
            studentTimesArray[i] = newStr;
        }
        
        // get tutor database info
        let selectedTutorName = (selectTutor.value).split(" ")[0];
        let selectedTutorID = (selectTutor.value).split(" ")[1];

        if (typeof selectedTutorID !== "undefined") {

            ipcRenderer.send('get-tutor-info', selectedTutorID);
            
            ipcRenderer.on('tutor-info-response', (data) => {
                tutorLocation = data.location_status;
                studentLocation = studentLocationStatusValue;

                if (studentLocation === tutorLocation) {
                    meetingType.innerHTML = convertLocation(studentLocation);
                }
                else if(studentLocation === 'Both') {
                    meetingType.innerHTML = convertLocation(tutorLocation);
                }
                else if(tutorLocation === 'Both') {
                    meetingType.innerHTML = convertLocation(studentLocation);
                }
                else {
                    meetingType.innerHTML = "None";
                }

                commonSubjects = [...new Set(data.subjects)].filter(x => new Set(studentSubjectValues).has(x));
                let str = ""
                for (let i = 0; i < commonSubjects.length; i++) {
                    str += commonSubjects[i]
                    if (i < commonSubjects.length - 1) {
                        str += ", ";
                    }
                }
                sharedSubjects.innerHTML = str ? str : "None";

                tutorAvailability = [data.mon, data.tues, data.wed, data.thurs, data.fri, data.sat, data.sun];
                studentAvailability = studentTimesArray;

                for (let i = 0; i < weekArray.length; i++) {
                    if (tutorAvailability[i] && studentAvailability[i]) {
                        // tutor 
                        
                        tutorTimePeriod = tutorAvailability[i].split(", ").filter(function(el) {
                            return el !== "";
                        });

                        tutorValArr = []
                        for (let j = 0; j < tutorTimePeriod.length; j++) {
                            pair = timeConverter(tutorTimePeriod[j]) // [a, b]
                            res = Array.from({length: (pair[pair.length - 1]-pair[0])/0.5 + 1}, (_, k) => pair[0] + k*0.5);
                            tutorValArr = [...tutorValArr, ...res];
                        }
                        // student

                        studentTimePeriod = studentAvailability[i].split(", ").filter(function(el) {
                            return el !== "";
                        });

                        studentValArr = []
                        for (let j = 0; j < studentTimePeriod.length; j++) {
                            pair = timeConverter(studentTimePeriod[j]) // [a, b]
                            res = Array.from({length: (pair[pair.length - 1]-pair[0])/0.5 + 1}, (_, k) => pair[0] + k*0.5);
                            studentValArr = [...studentValArr, ...res];
                        }
                        commonElements = [...new Set(tutorValArr)].filter(x => new Set(studentValArr).has(x));
                        commonElements.sort((a, b) => a - b);

                        let subArray = [];
                        let dayMatches = "";
                        for (let i = 0; i < commonElements.length; i++) {
                            if (i + 1 >= commonElements.length && commonElements[i] - commonElements[i - 1] === 0.5) {
                                subArray.push(commonElements[i]);
                                break;
                            }
                            if (commonElements[i + 1] - commonElements[i] === 0.5) {
                                subArray.push(commonElements[i]);
                            } else {
                                subArray.push(commonElements[i]);
                                dayMatches += reverseTimeConverter([subArray[0], subArray[subArray.length - 1]]) + ", "
                                subArray = [];
                            }
                        }
                        dayMatches += reverseTimeConverter([subArray[0], subArray[subArray.length - 1]]) + ", "
                        document.getElementById(weekArray[i] + "-shared-timings").innerHTML = dayMatches;
                        
                    }
                    else {
                        document.getElementById(weekArray[i] + "-shared-timings").innerHTML = "None";
                    }
                }
            });
            sharedInfo.style.display = "block";
        }
        else {
            sharedInfo.style.display = "none";
        }
    }
};

tutorForm.addEventListener('submit', (event) => {
    const tutorNameValue = tutorName.value;
    const tutorEmailValue = tutorEmail.value;
    var tutorNumberValue = tutorNumber.value;
    const tutorSubjectValues = [];
    for (var option of tutorSubjects.selectedOptions) {
        tutorSubjectValues.push(option.value);
    }
    const locationStatusValue = locationStatus.value;
    const timesArray = []
    for (var day of weekArray) {
        str = document.getElementById("start-time-" + day).value + " " +
        document.getElementById("start-ampm-" + day).value + " to " +
        document.getElementById("end-time-" + day).value + " " +
        document.getElementById("end-ampm-" + day).value + " / "

        str += document.getElementById("start-time-" + day + "-1").value + " " +
        document.getElementById("start-ampm-" + day + "-1").value + " to " +
        document.getElementById("end-time-" + day + "-1").value + " " +
        document.getElementById("end-ampm-" + day + "-1").value + " / " +

        document.getElementById("start-time-" + day + "-2").value + " " +
        document.getElementById("start-ampm-" + day + "-2").value + " to " +
        document.getElementById("end-time-" + day + "-2").value + " " +
        document.getElementById("end-ampm-" + day + "-2").value

        timesArray.push(str);
    }
    const otherInfoValue = otherInfo.value;

    if (tutorNameValue.length <= 2) {
        alertError(addTutorAlerter,"Name should be greater than 2 characters.")
    }
    else if (!isValidEmail(tutorEmailValue) && tutorEmailValue != "N/A") {
        alertError(addTutorAlerter,"Invalid Email.")
    }
    else if (!isValidPhoneNumber(tutorNumberValue)) {
        alertError(addTutorAlerter,"Invalid Phone Number.")
    }
    else if (tutorSubjectValues.length === 0) {
        alertError(addTutorAlerter,"Please enter at least one subject.")
    }
    else if(!validateTime(timesArray)) {
        alertError(addTutorAlerter,"Please enter valid timings.")
    }
    else {
        document.getElementById("add-tutor-page").querySelector('form').reset();
        removeError(addTutorAlerter);
        if (tutorNumberValue == "000-000-0000") {
            tutorNumberValue = 'N/A'
        }
        for (let i = 0; i < timesArray.length; i++) {
            newStr = ""
            arr = timesArray[i].split(" / ");
            for (let i = 0; i < arr.length; i++) {
                chars = arr[i].split(" ");
                if (chars[0] !== chars[3]) {
                    newStr += arr[i];
                    if (i !== arr.length - 1) {
                        newStr += ", ";
                    }
                }
            }
            timesArray[i] = newStr;
        }
        if (tutorEditID) {
            ipcRenderer.send('edit-tutor-in-database', ([
                tutorEditID,
                tutorNameValue,
                tutorEmailValue,
                tutorNumberValue,
                tutorSubjectValues,
                locationStatusValue,
                timesArray,
                otherInfoValue,
            ]));

        }
        else {
            ipcRenderer.send('add-tutor-to-database', ([
                tutorNameValue,
                tutorEmailValue,
                tutorNumberValue,
                tutorSubjectValues,
                locationStatusValue,
                timesArray,
                otherInfoValue,
            ]));
        }
        setTimeout(function() {
            // Code to be executed after one second
            ipcRenderer.send('refresh-tutors');
            ipcRenderer.send('refresh-students');
            tutorModal.style.display = "none";
            changePageFromForm("Manage Tutors", document.getElementById("tutor-page"));
        }, 600);
    }
    event.preventDefault();
});

studentForm.addEventListener('submit', (event) => {
    let {studentNameValue, studentNumberValue, parentNameValue, parentEmailValue,
        parentNumberValue, studentSubjectValues, studentLocationStatusValue, studentTimesArray,
        otherStudentInfoValue, tutorOptionArr} = studentFormEntry()
    if (studentNameValue.length <= 2) {
        alertError(addStudentAlerter,"Student Name should be greater than 2 characters.");
    }
    else if (!isValidPhoneNumber(studentNumberValue)) {
        alertError(addStudentAlerter,"Invalid Student Phone Number.");
    }
    else if (parentNameValue.length <= 2) {
        alertError(addStudentAlerter,"Parent Name should be greater than 2 characters.");
    }
    else if (!isValidEmail(parentEmailValue) && parentEmailValue != "N/A") {
        alertError(addStudentAlerter,"Invalid Parent Email.");
    }
    else if (!isValidPhoneNumber(parentNumberValue) && parentNumberValue != "N/A") {
        alertError(addStudentAlerter,"Invalid Parent Phone Number.");
    }
    else if (studentSubjectValues.length === 0) {
        alertError(addStudentAlerter,"Please enter at least one subject.");
    }
    else if(!validateTime(studentTimesArray)) {
        alertError(addStudentAlerter,"Please enter valid timings.");
    }
    else {
        document.getElementById("add-student-page").querySelector('form').reset();
        removeError(addStudentAlerter);
        if (studentNumberValue == "000-000-0000") {
            studentNumberValue = 'N/A'
        }
        if (parentNumberValue == "000-000-0000") {
            parentNumberValue = 'N/A'
        }
        if (tutorOptionArr[tutorOptionArr.length - 1] === "None") { //id
            tutorOptionArr[tutorOptionArr.length - 1] = "";
        }
        for (let i = 0; i < studentTimesArray.length; i++) {
            // one time string / /
            newStr = ""
            let arr = studentTimesArray[i].split(" / ");
            for (let i = 0; i < arr.length; i++) {
                chars = arr[i].split(" ");
                if (chars[0] !== chars[3]) {
                    newStr += arr[i];
                    if (i < arr.length - 1) {
                        newStr += ", ";
                    }
                }
            }
            studentTimesArray[i] = newStr;
        }
        console.log("Made it here...");
        ipcRenderer.send('add-student-to-database', ([
            studentNameValue,
            studentNumberValue,
            parentNameValue,
            parentEmailValue,
            parentNumberValue,
            studentSubjectValues,
            studentLocationStatusValue,
            studentTimesArray,
            otherStudentInfoValue,
            tutorOptionArr[tutorOptionArr.length - 1], // tutor id
            tutorOptionArr[0]
        ]));
        setTimeout(function() {
            // Code to be executed after one second
            ipcRenderer.send('refresh-students');
            ipcRenderer.send('refresh-tutors');
            studentModal.style.display = "none";
            changePageFromForm("Manage Students", document.getElementById("student-page"));
        }, 600);
    }
    event.preventDefault();
});

function studentFormEntry() {
    let studentSubjectValues = [];

    for (var option of studentSubjects.selectedOptions) {
        studentSubjectValues.push(option.value);
    }

    let studentTimesArray = []
    for (var day of weekArray) {
        let str = document.getElementById("student-start-time-" + day).value + " " +
        document.getElementById("student-start-ampm-" + day).value + " to " +
        document.getElementById("student-end-time-" + day).value + " " +
        document.getElementById("student-end-ampm-" + day).value + " / "

        str += document.getElementById("student-start-time-" + day + "-1").value + " " +
            document.getElementById("student-start-ampm-" + day + "-1").value + " to " +
            document.getElementById("student-end-time-" + day + "-1").value + " " +
            document.getElementById("student-end-ampm-" + day + "-1").value + " / " +
    
            document.getElementById("student-start-time-" + day + "-2").value + " " +
            document.getElementById("student-start-ampm-" + day + "-2").value + " to " +
            document.getElementById("student-end-time-" + day + "-2").value + " " +
            document.getElementById("student-end-ampm-" + day + "-2").value
        studentTimesArray.push(str);
    }
    selectedTutorOption = tutorSelection.value
    return {
        studentNameValue: studentName.value, 
        studentNumberValue: studentNumber.value, 
        parentNameValue: parentName.value,
        parentEmailValue: parentEmail.value,
        parentNumberValue: parentNumber.value,
        studentSubjectValues: studentSubjectValues,
        studentLocationStatusValue: studentLocationStatus.value,
        studentTimesArray: studentTimesArray,
        otherStudentInfoValue: otherStudentInfo.value,
        tutorOptionArr: selectedTutorOption.split(" "),
    };
}

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    const phoneNumberPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneNumberPattern.test(phoneNumber);
}

function alertError(alertObject, message) {
    alertObject.innerHTML = message;
    alertObject.style.display = 'block';
}

function removeError(alertObject) {alertObject.style.display = 'none';}

function timeConverter(time) {
    arr = time.split(" ");
    x = parseFloat(arr[0]);
    if (arr[1] == 'pm') {
        x += 12;
    }
    y = parseFloat(arr[3]);
    if (arr[4] == 'pm') {
        y += 12;
    }
    return [x, y];
}

function reverseTimeConverter(timeArray) {
    let x = timeArray[0];
    let y = timeArray[1];
    let xAmPm = (x < 12) ? "am" : "pm";
    let yAmPm = (y < 12) ? "am" : "pm";
    if (x > 12) x -= 12;
    if (y > 12) y -= 12;
    
    if (parseFloat(x) !== parseInt(x)) {
        x = parseInt(x)
        xString = x.toString().padStart(2, "0") + ":30 "
    }
    else {
        xString = x.toString().padStart(2, "0") + ":00 "
    }

    if (parseFloat(y) !== parseInt(y)) {
        y = parseInt(y)
        yString = (y.toString()).padStart(2, "0") + ":30 "
    }
    else {
        yString = y.toString().padStart(2, "0") + ":00 "
    }
    return xString + xAmPm + " - " + yString + yAmPm;
}

function validateTime(timesArr) {
    bool = true;
    for (var i = 0; i < timesArr.length; i++) {
        str = timesArr[i].split(" / ");
        a = timeConverter(str[0]); // original time
        if (a[0] > a[1]) {
            bool = false;
        }
        b = timeConverter(str[1]); // time 1
        if (b[0] > b[1]) {
            bool = false;
        }
        c = timeConverter(str[2]); // time 2
        if (c[0] > c[1]) {
            bool = false;
        }
    }
    return bool;
}

function changePageFromForm(text, pageEvent) {
    removeCurrentPageFromForm();
    title.innerHTML = text;
    pageEvent.style.display = "block";
}

function removeCurrentPageFromForm() {
    dashboardPage.style.display = "none";
    tutorPage.style.display = "none";
    studentPage.style.display = "none";
    aboutPage.style.display = "none";
    addTutorPage.style.display = "none";
    findTutorPage.style.display = "none";
    addStudentPage.style.display = "none";
    findStudentPage.style.display = "none";
    editTutorPage.style.display = "none";
}

function convertLocation(locString) {
    if (locString === "Both") {
        locString = "In Person and/or Remote"
    }
    return locString;
}