// Checkmark Form Controllers
var monCheck = document.getElementById("monday-check")
var tuesCheck = document.getElementById("tuesday-check")
var wedCheck = document.getElementById("wednesday-check")
var thursCheck = document.getElementById("thursday-check")
var friCheck = document.getElementById("friday-check")
var satCheck = document.getElementById("saturday-check")
var sunCheck = document.getElementById("sunday-check")

var studentMonCheck = document.getElementById("s-monday-check")
var studentTuesCheck = document.getElementById("s-tuesday-check")
var studentWedCheck = document.getElementById("s-wednesday-check")
var studentThursCheck = document.getElementById("s-thursday-check")
var studentFriCheck = document.getElementById("s-friday-check")
var studentSatCheck = document.getElementById("s-saturday-check")
var studentSunCheck = document.getElementById("s-sunday-check")

const addTimingButtons = document.querySelectorAll('.add-timing');
const subTimingButtons = document.querySelectorAll('.sub-timing');

const studentAddTimingButtons = document.querySelectorAll('.student-add-timing');
const studentSubTimingButtons = document.querySelectorAll('.student-sub-timing');

studentAddTimingButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (document.getElementById(event.target.id + "-timing-1").style.display === "block") {
            document.getElementById(event.target.id + "-timing-2").style.display = "block";
        }
        else {
            document.getElementById(event.target.id + "-timing-1").style.display = "block";
        }
    });
});
studentSubTimingButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (event.target.id === "student-sub-monday-1") {
            document.getElementById("student-add-monday-timing-1").style.display = "none";
            document.getElementById("student-start-time-monday-1").value = "1";
            document.getElementById("student-end-time-monday-1").value = "1";
            document.getElementById("student-start-ampm-monday-1").value = "am";
            document.getElementById("student-end-ampm-monday-1").value = "am";
        }
        if (event.target.id === "student-sub-monday-2") {
            document.getElementById("student-add-monday-timing-2").style.display = "none";
            document.getElementById("student-start-time-monday-2").value = "1";
            document.getElementById("student-end-time-monday-2").value = "1";
            document.getElementById("student-start-ampm-monday-2").value = "am";
            document.getElementById("student-end-ampm-monday-2").value = "am";
        }
        if (event.target.id === "student-sub-tuesday-1") {
            document.getElementById("student-add-tuesday-timing-1").style.display = "none";
            document.getElementById("student-start-time-tuesday-1").value = "1";
            document.getElementById("student-end-time-tuesday-1").value = "1";
            document.getElementById("student-start-ampm-tuesday-1").value = "am";
            document.getElementById("student-end-ampm-tuesday-1").value = "am";
        }
        if (event.target.id === "student-sub-tuesday-2") {
            document.getElementById("student-add-tuesday-timing-2").style.display = "none";
            document.getElementById("student-start-time-tuesday-2").value = "1";
            document.getElementById("student-end-time-tuesday-2").value = "1";
            document.getElementById("student-start-ampm-tuesday-2").value = "am";
            document.getElementById("student-end-ampm-tuesday-2").value = "am";
        }
        if (event.target.id === "student-sub-wednesday-1") {
            document.getElementById("student-add-wednesday-timing-1").style.display = "none";
            document.getElementById("student-start-time-wednesday-1").value = "1";
            document.getElementById("student-end-time-wednesday-1").value = "1";
            document.getElementById("student-start-ampm-wednesday-1").value = "am";
            document.getElementById("student-end-ampm-wednesday-1").value = "am";
        }
        if (event.target.id === "student-sub-wednesday-2") {
            document.getElementById("student-add-wednesday-timing-2").style.display = "none";
            document.getElementById("student-start-time-wednesday-2").value = "1";
            document.getElementById("student-end-time-wednesday-2").value = "1";
            document.getElementById("student-start-ampm-wednesday-2").value = "am";
            document.getElementById("student-end-ampm-wednesday-2").value = "am";
        }
        if (event.target.id === "student-sub-thursday-1") {
            document.getElementById("student-add-thursday-timing-1").style.display = "none";
            document.getElementById("student-start-time-thursday-1").value = "1";
            document.getElementById("student-end-time-thursday-1").value = "1";
            document.getElementById("student-start-ampm-thursday-1").value = "am";
            document.getElementById("student-end-ampm-thursday-1").value = "am";
        }
        if (event.target.id === "student-sub-thursday-2") {
            document.getElementById("student-add-thursday-timing-2").style.display = "none";
            document.getElementById("student-start-time-thursday-2").value = "1";
            document.getElementById("student-end-time-thursday-2").value = "1";
            document.getElementById("student-start-ampm-thursday-2").value = "am";
            document.getElementById("student-end-ampm-thursday-2").value = "am";
        }
        if (event.target.id === "student-sub-friday-1") {
            document.getElementById("student-add-friday-timing-1").style.display = "none";
            document.getElementById("student-start-time-friday-1").value = "1";
            document.getElementById("student-end-time-friday-1").value = "1";
            document.getElementById("student-start-ampm-friday-1").value = "am";
            document.getElementById("student-end-ampm-friday-1").value = "am";
        }
        if (event.target.id === "student-sub-friday-2") {
            document.getElementById("student-add-friday-timing-2").style.display = "none";
            document.getElementById("student-start-time-friday-2").value = "1";
            document.getElementById("student-end-time-friday-2").value = "1";
            document.getElementById("student-start-ampm-friday-2").value = "am";
            document.getElementById("student-end-ampm-friday-2").value = "am";
        }
        if (event.target.id === "student-sub-saturday-1") {
            document.getElementById("student-add-saturday-timing-1").style.display = "none";
            document.getElementById("student-start-time-saturday-1").value = "1";
            document.getElementById("student-end-time-saturday-1").value = "1";
            document.getElementById("student-start-ampm-saturday-1").value = "am";
            document.getElementById("student-end-ampm-saturday-1").value = "am";
        }
        if (event.target.id === "student-sub-saturday-2") {
            document.getElementById("student-add-saturday-timing-2").style.display = "none";
            document.getElementById("student-start-time-saturday-2").value = "1";
            document.getElementById("student-end-time-saturday-2").value = "1";
            document.getElementById("student-start-ampm-saturday-2").value = "am";
            document.getElementById("student-end-ampm-saturday-2").value = "am";
        }
        if (event.target.id === "student-sub-sunday-1") {
            document.getElementById("student-add-sunday-timing-1").style.display = "none";
            document.getElementById("student-start-time-sunday-1").value = "1";
            document.getElementById("student-end-time-sunday-1").value = "1";
            document.getElementById("student-start-ampm-sunday-1").value = "am";
            document.getElementById("student-end-ampm-sunday-1").value = "am";
        }
        if (event.target.id === "student-sub-sunday-2") {
            document.getElementById("student-add-sunday-timing-2").style.display = "none";
            document.getElementById("student-start-time-sunday-2").value = "1";
            document.getElementById("student-end-time-sunday-2").value = "1";
            document.getElementById("student-start-ampm-sunday-2").value = "am";
            document.getElementById("student-end-ampm-sunday-2").value = "am";
        }
    });
});

addTimingButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (document.getElementById(event.target.id + "-timing-1").style.display === "block") {
            document.getElementById(event.target.id + "-timing-2").style.display = "block";
        }
        else {
            document.getElementById(event.target.id + "-timing-1").style.display = "block";
        }
    });
});
subTimingButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (event.target.id === "sub-monday-1") {
            document.getElementById("add-monday-timing-1").style.display = "none";
            document.getElementById("start-time-monday-1").value = "1";
            document.getElementById("end-time-monday-1").value = "1";
            document.getElementById("start-ampm-monday-1").value = "am";
            document.getElementById("end-ampm-monday-1").value = "am";
        }
        if (event.target.id === "sub-monday-2") {
            document.getElementById("add-monday-timing-2").style.display = "none";
            document.getElementById("start-time-monday-2").value = "1";
            document.getElementById("end-time-monday-2").value = "1";
            document.getElementById("start-ampm-monday-2").value = "am";
            document.getElementById("end-ampm-monday-2").value = "am";
        }
        if (event.target.id === "sub-tuesday-1") {
            document.getElementById("add-tuesday-timing-1").style.display = "none";
            document.getElementById("start-time-tuesday-1").value = "1";
            document.getElementById("end-time-tuesday-1").value = "1";
            document.getElementById("start-ampm-tuesday-1").value = "am";
            document.getElementById("end-ampm-tuesday-1").value = "am";
        }
        if (event.target.id === "sub-tuesday-2") {
            document.getElementById("add-tuesday-timing-2").style.display = "none";
            document.getElementById("start-time-tuesday-2").value = "1";
            document.getElementById("end-time-tuesday-2").value = "1";
            document.getElementById("start-ampm-tuesday-2").value = "am";
            document.getElementById("end-ampm-tuesday-2").value = "am";
        }
        if (event.target.id === "sub-wednesday-1") {
            document.getElementById("add-wednesday-timing-1").style.display = "none";
            document.getElementById("start-time-wednesday-1").value = "1";
            document.getElementById("end-time-wednesday-1").value = "1";
            document.getElementById("start-ampm-wednesday-1").value = "am";
            document.getElementById("end-ampm-wednesday-1").value = "am";
        }
        if (event.target.id === "sub-wednesday-2") {
            document.getElementById("add-wednesday-timing-2").style.display = "none";
            document.getElementById("start-time-wednesday-2").value = "1";
            document.getElementById("end-time-wednesday-2").value = "1";
            document.getElementById("start-ampm-wednesday-2").value = "am";
            document.getElementById("end-ampm-wednesday-2").value = "am";
        }
        if (event.target.id === "sub-thursday-1") {
            document.getElementById("add-thursday-timing-1").style.display = "none";
            document.getElementById("start-time-thursday-1").value = "1";
            document.getElementById("end-time-thursday-1").value = "1";
            document.getElementById("start-ampm-thursday-1").value = "am";
            document.getElementById("end-ampm-thursday-1").value = "am";
        }
        if (event.target.id === "sub-thursday-2") {
            document.getElementById("add-thursday-timing-2").style.display = "none";
            document.getElementById("start-time-thursday-2").value = "1";
            document.getElementById("end-time-thursday-2").value = "1";
            document.getElementById("start-ampm-thursday-2").value = "am";
            document.getElementById("end-ampm-thursday-2").value = "am";
        }
        if (event.target.id === "sub-friday-1") {
            document.getElementById("add-friday-timing-1").style.display = "none";
            document.getElementById("start-time-friday-1").value = "1";
            document.getElementById("end-time-friday-1").value = "1";
            document.getElementById("start-ampm-friday-1").value = "am";
            document.getElementById("end-ampm-friday-1").value = "am";
        }
        if (event.target.id === "sub-friday-2") {
            document.getElementById("add-friday-timing-2").style.display = "none";
            document.getElementById("start-time-friday-2").value = "1";
            document.getElementById("end-time-friday-2").value = "1";
            document.getElementById("start-ampm-friday-2").value = "am";
            document.getElementById("end-ampm-friday-2").value = "am";
        }
        if (event.target.id === "sub-saturday-1") {
            document.getElementById("add-saturday-timing-1").style.display = "none";
            document.getElementById("start-time-saturday-1").value = "1";
            document.getElementById("end-time-saturday-1").value = "1";
            document.getElementById("start-ampm-saturday-1").value = "am";
            document.getElementById("end-ampm-saturday-1").value = "am";
        }
        if (event.target.id === "sub-saturday-2") {
            document.getElementById("add-saturday-timing-2").style.display = "none";
            document.getElementById("start-time-saturday-2").value = "1";
            document.getElementById("end-time-saturday-2").value = "1";
            document.getElementById("start-ampm-saturday-2").value = "am";
            document.getElementById("end-ampm-saturday-2").value = "am";
        }
        if (event.target.id === "sub-sunday-1") {
            document.getElementById("add-sunday-timing-1").style.display = "none";
            document.getElementById("start-time-sunday-1").value = "1";
            document.getElementById("end-time-sunday-1").value = "1";
            document.getElementById("start-ampm-sunday-1").value = "am";
            document.getElementById("end-ampm-sunday-1").value = "am";
        }
        if (event.target.id === "sub-sunday-2") {
            document.getElementById("add-sunday-timing-2").style.display = "none";
            document.getElementById("start-time-sunday-2").value = "1";
            document.getElementById("end-time-sunday-2").value = "1";
            document.getElementById("start-ampm-sunday-2").value = "am";
            document.getElementById("end-ampm-sunday-2").value = "am";
        }
    });
});

// Null Week Event handlers
monCheck.addEventListener('change', function() {
    grayElement('monday', monCheck.checked, "");
});
tuesCheck.addEventListener('change', function() {
    grayElement('tuesday', tuesCheck.checked, "");
});
wedCheck.addEventListener('change', function() {
    grayElement('wednesday', wedCheck.checked, "");
});
thursCheck.addEventListener('change', function() {
    grayElement('thursday', thursCheck.checked, "");
});
friCheck.addEventListener('change', function() {
    grayElement('friday', friCheck.checked, "");
});
satCheck.addEventListener('change', function() {
    grayElement('saturday', satCheck.checked, "");
});
sunCheck.addEventListener('change', function() {
    grayElement('sunday', sunCheck.checked, "");
});
studentMonCheck.addEventListener('change', function() {
    grayElement('monday', studentMonCheck.checked, "student-");
});
studentTuesCheck.addEventListener('change', function() {
    grayElement('tuesday', studentTuesCheck.checked, "student-");
});
studentWedCheck.addEventListener('change', function() {
    grayElement('wednesday', studentWedCheck.checked, "student-");
});
studentThursCheck.addEventListener('change', function() {
    grayElement('thursday', studentThursCheck.checked, "student-");
});
studentFriCheck.addEventListener('change', function() {
    grayElement('friday', studentFriCheck.checked, "student-");
});
studentSatCheck.addEventListener('change', function() {
    grayElement('saturday', studentSatCheck.checked, "student-");
});
studentSunCheck.addEventListener('change', function() {
    grayElement('sunday', studentSunCheck.checked, "student-");
});

function grayElement(weekDay, bool, conc) {
    if (bool) {
        // Checked
        document.getElementById(conc + "add-" + weekDay).disabled = true;
        document.getElementById(conc + "add-" + weekDay + "-timing-1").style.display = "none";
        document.getElementById(conc + "add-" + weekDay + "-timing-2").style.display = "none";

        document.getElementById(conc + "start-time-" + weekDay + "-1").value = "1";
        document.getElementById(conc + "end-time-" + weekDay + "-1").value = "1";
        document.getElementById(conc + "start-ampm-" + weekDay + "-1").value = "am";
        document.getElementById(conc + "end-ampm-" + weekDay + "-1").value = "am";

        document.getElementById(conc + "start-time-" + weekDay + "-2").value = "1";
        document.getElementById(conc + "end-time-" + weekDay + "-2").value = "1";
        document.getElementById(conc + "start-ampm-" + weekDay + "-2").value = "am";
        document.getElementById(conc + "end-ampm-" + weekDay + "-2").value = "am";

        document.getElementById(conc + "start-time-" + weekDay).style.color = 'gray';
        document.getElementById(conc + "start-time-" + weekDay).style.pointerEvents = 'none';
        document.getElementById(conc +"start-time-" + weekDay).value = '1';

        document.getElementById(conc + "start-ampm-" + weekDay).style.color = 'gray';
        document.getElementById(conc + "start-ampm-" + weekDay).style.pointerEvents = 'none';
        document.getElementById(conc + "start-ampm-" + weekDay).value = 'am';

        document.getElementById(conc + "end-time-" + weekDay).style.color = 'gray';
        document.getElementById(conc + "end-time-" + weekDay).style.pointerEvents = 'none';
        document.getElementById(conc + "end-time-" + weekDay).style.value = '1';

        document.getElementById(conc + "end-ampm-" + weekDay).style.color = 'gray';
        document.getElementById(conc + "end-ampm-" + weekDay).style.pointerEvents = 'none';
        document.getElementById(conc + "end-ampm-" + weekDay).style.value = 'am';
    } 
    else {
        // Unchecked
        document.getElementById(conc + "add-" + weekDay).disabled = false;

        document.getElementById(conc + "start-time-" + weekDay).style.color = '';
        document.getElementById(conc + "start-time-" + weekDay).style.pointerEvents = '';

        document.getElementById(conc + "start-ampm-" + weekDay).style.color = '';
        document.getElementById(conc + "start-ampm-" + weekDay).style.pointerEvents = '';

        document.getElementById(conc + "end-time-" + weekDay).style.color = '';
        document.getElementById(conc + "end-time-" + weekDay).style.pointerEvents = '';

        document.getElementById(conc + "end-ampm-" + weekDay).style.color = '';
        document.getElementById(conc + "end-ampm-" + weekDay).style.pointerEvents = '';
    }   
};