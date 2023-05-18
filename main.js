const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog, webContents, ipcRenderer} = require('electron');
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const sqlite3 = require('sqlite3');
const idRegex = /^[0-9a-fA-F]{24}$/;
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const globalClient = {};

// Creates main window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'LEARNLEE Application',
        width: 1000,
        height: 700,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
    return mainWindow;
};

function createLoginWindow() {
    const loginWindow = new BrowserWindow({
        title: 'LEARNLEE Application Log In',
        width: 700,
        height: 400,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    if (isDev) {
        loginWindow.webContents.openDevTools();
    }
    loginWindow.loadFile(path.join(__dirname, './renderer/loginpage.html'));
    return loginWindow;
};

function connectDatabase(username, password) {
    const uri = `mongodb+srv://${username}:${password}@learnleemain.ygjcnka.mongodb.net/?retryWrites=true&w=majority`;
    globalClient.property = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
    return new Promise((resolve, reject) => {
      globalClient.property.connect(err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
}

// App is ready
app.whenReady().then(() => { // acts as a void function
    //mainWin = createMainWindow();
    loginWin = createLoginWindow();
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            loginWin = createLoginWindow();
        }
    })

    ipcMain.on('send-login-info', (event, arg) => {
        // gets returned promise
        connectDatabase(arg[0], arg[1])
            .then(() => {
                event.sender.send('correct-login');
                loginWin.close();
                mainWin = createMainWindow();
            })
            .catch(error => {
                event.sender.send('incorrect-login');
            }); 
    });
});

// Menu template 
const menu = [
    {
        label: "Options",
        submenu: [
            {
                label: "Quit",
                click: () => app.quit(),
                accelerator: 'CmdOrCtrl+W',
            }
        ]
    }
];

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (globalClient.property) {
            globalClient.property.close();
        }
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

ipcMain.on('add-tutor-to-database', (event, arg) => {
    var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");

    const date = new Date();
    tutorCollection.insertOne({ 
        name: arg[0], 
        createdAt: date,
        email: arg[1], 
        phone_number: arg[2], 
        subjects: arg[3],
        location_status: arg[4],
        mon: arg[5][0],
        tues: arg[5][1],
        wed: arg[5][2],
        thurs: arg[5][3],
        fri: arg[5][4],
        sat: arg[5][5],
        sun: arg[5][6],
        other_info: arg[6],
        student_ids: [],
        student_names: [],
    });
});

ipcMain.on('add-student-to-database', (event, arg) => {
    var studentCollection = globalClient.property.db("learnleedatabase").collection("Students");
    var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");

    if (arg[9] !== "None") {
        tutorIDValue = arg[9];
        tutorNameValue = arg[10];
    }
    else {
        tutorIDValue = "None"
        tutorNameValue = ""
    }
    const date = new Date();
    studentCollection.insertOne({ 
        name: arg[0],
        createdAt: date,
        phone_number: arg[1],
        parent_name: arg[2],
        parent_email: arg[3],
        parent_number: arg[4],
        subjects: arg[5],
        location_status: arg[6],
        mon: arg[7][0],
        tues: arg[7][1],
        wed: arg[7][2],
        thurs: arg[7][3],
        fri: arg[7][4],
        sat: arg[7][5],
        sun: arg[7][6],
        other_info: arg[8],
        tutor_id: tutorIDValue,
        tutor_name: tutorNameValue,
    }, (err, result) => {
        if (tutorIDValue) {
            // const win = new BrowserWindow({
            //     title: "Here: " + result.insertedId,
            //     width: 400,
            //     height: 300,
            // });
            tutorCollection.updateOne(
                { _id: ObjectId(tutorIDValue) },
                { $push: { student_ids: result.insertedId, student_names: arg[0]} },
            );
        }
    });
});

ipcMain.on('refresh-tutors', (event) => {
    var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");
    
    try {
        tutorCollection.find().toArray((err, documents) => {
            if (documents) {
                for (let i = 0; i < documents.length; i++) {
                    documents[i]._id = documents[i]._id.toHexString();
                }
                event.sender.send('tutor-database-response', documents);
            }
        });
    } catch (error) {
        throw error;
    }
});

ipcMain.on('refresh-students', (event) => {
    var studentCollection = globalClient.property.db("learnleedatabase").collection("Students");

    studentCollection.find().toArray((err, documents) => {
        if (documents) {
            for (let i = 0; i < documents.length; i++) {
                documents[i]._id = documents[i]._id.toHexString();
            }
            event.sender.send('student-database-response', documents);
        }
    });
});

ipcMain.on('get-tutor-info', (event, arg) => {
    var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");
    if (typeof arg === "string" && idRegex.test(arg)) {
        try {
            const id = new ObjectId(arg);
            tutorCollection.findOne({_id: id}, function(err, doc) {
                event.sender.send('tutor-info-response', doc);
            });
        }
        catch(err) {
            throw err;
        }
    }
});

ipcMain.on('get-student-info', (event, arg) => {
    var studentCollection = globalClient.property.db("learnleedatabase").collection("Students");

    try {
        // code that may throw an exception
        const id = new ObjectId(arg);
        studentCollection.findOne({_id: id}, function(err, doc) {
            event.sender.send('student-info-response', doc);
        });
    } catch (error) {
        throw error;
    }
});

ipcMain.on('remove-tutor', (event, arg) => {
    var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");
    var studentCollection = globalClient.property.db("learnleedatabase").collection("Students");

    const findTutorQuery = { _id: ObjectId(arg) };

    tutorCollection.findOne(findTutorQuery, function(err, result) {
        if (err) throw err;
        try {
            tutorCollection.deleteOne(findTutorQuery, function(err, res) {
                if (err) throw err;
            });

            // remove tutor_id and tutor_name values from every Student with Tutor
            if (result.student_ids && result.student_ids !== null) {
                let findStudentsQuery = { _id: { $in: result.student_ids.map(ObjectId) } };
                let updateStudentQuery = { $set: { tutor_id: "", tutor_name: ""}  };;

                studentCollection.updateMany(findStudentsQuery, updateStudentQuery, function(err, result) {
                    if (err) throw err;
                });
            }
        }
        catch(error) {
            throw error;
        }
    });
});

ipcMain.on('remove-student', (event, arg) => {
    var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");
    var studentCollection = globalClient.property.db("learnleedatabase").collection("Students");

    let findStudentQuery = { _id: ObjectId(arg) };

    // finds student
    studentCollection.findOne(findStudentQuery, function(err, result) {
        if (err) throw err;
        const tutorID = result.tutor_id
        const studentName = result.name

        // deletes student
        studentCollection.deleteOne(findStudentQuery, function(err, res) {
            if (err) throw err;
        });

        // removes student id and name from Tutor
        if (tutorID) {
            const findTutorQuery = {_id: ObjectId(tutorID)};
            const removeStudentValues = { $pull: {student_ids: ObjectId(arg), student_names: result.name}  }
            tutorCollection.updateOne(findTutorQuery, removeStudentValues, function(err, result) {
                if (err) throw err;
            });
        }
    });
});

// ipcMain.on('edit-tutor-in-database', (event, arg) => {
//     var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");
//     var studentCollection = globalClient.property.db("learnleedatabase").collection("Students");

//     tutorID = arg[0];

//     let findTutorQuery = {_id: ObjectId(tutorID)};
//     let updateTutorQuery = { $set: { 
//         name: arg[1], 
//         email: arg[2],
//         phone_number: arg[3],
//         subjects: arg[4],
//         location_status: arg[5],
//         mon: arg[6][0],
//         tues: arg[6][1],
//         wed: arg[6][2],
//         thurs: arg[6][3],
//         fri: arg[6][4],
//         sat: arg[6][5],
//         sun: arg[6][6],
//         other_info: arg[7],
//     }};

//     tutorCollection.updateOne(findTutorQuery, updateTutorQuery, function(err, result) {
//         if (err) throw err;
//         tutorCollection.findOne(findTutorQuery, function(err, updatedDoc) {
//             if (err) throw err;
//             if (updatedDoc && updatedDoc.student_ids !== null) {
//                 try {
//                     studentCollection.updateMany(
//                         { _id: { $in: updatedDoc.student_ids} },
//                         { $set: { tutor_name: updatedDoc.name } }
//                     );
//                 } catch(err) {
//                     throw err;
//                 }
//             }
//         });
//     });
// });

// ipcMain.on('edit-student-in-database', (event, arg) => {
//     var tutorCollection = globalClient.property.db("learnleedatabase").collection("Tutors");
//     var studentCollection = globalClient.property.db("learnleedatabase").collection("Students");

//     studentID = arg[0];

//     if (arg[10] !== "None") {
//         tutorIDValue = arg[10];
//         tutorNameValue = arg[11]
//     }
//     else {
//         tutorIDValue = "None"
//         tutorNameValue = ""
//     }

//     let findStudentQuery = {_id: ObjectId(studentID)};
//     let updateStudentQuery = { $set: { 
//         name: arg[1],
//         phone_number: arg[2],
//         parent_name: arg[3],
//         parent_email: arg[4],
//         parent_number: arg[5],
//         subjects: arg[6],
//         location_status: arg[7],
//         mon: arg[8][0],
//         tues: arg[8][1],
//         wed: arg[8][2],
//         thurs: arg[8][3],
//         fri: arg[8][4],
//         sat: arg[8][5],
//         sun: arg[8][6],
//         other_info: arg[9],
//         tutor_id: tutorIDValue,
//         tutor_name: tutorNameValue,
//     }};

//     studentCollection.findOne(findStudentQuery, function(err, prevStudentDoc) {
//         if (err) throw err;
//         // update student
//         studentCollection.updateOne(findStudentQuery, updateStudentQuery, function(err, updatedStudentDoc) {
//             if (err) throw err;
//             if (tutorIDValue) {
//                 try {
//                     // find the tutor that tutors the student
//                     tutorCollection.findOne({_id: ObjectId(tutorIDValue)}, function(err, tutorDoc) {
//                         tutorStudentNames = tutorDoc.student_names;
//                         tutorStudentIDs = tutorDoc.student_ids;
//                         temp = "";
//                         isFound = false;

//                         for (let i = 0; i < tutorStudentNames.length; i++) {
//                             // compares tutor's students with student name before update
//                             if (tutorStudentNames[i] === prevStudentDoc.name) {
//                                 // replace previous student name with new one in tutor collection
//                                 tutorStudentNames[i] = arg[1];
//                                 isFound = true;
//                             };
//                             temp += tutorStudentNames[i] + " "
//                         }

//                         if (isFound) {
//                             tutorCollection.updateOne(
//                                 { _id: ObjectId(tutorIDValue) },
//                                 { $set: {student_names: tutorStudentNames } },
//                             );
//                         };
//                     });
//                 } catch(err) {
//                     throw err;
//                 }
//             }
//         });
//         // if tutor change, remove current tutor and add new tutor
//     });

//     // studentCollection.updateOne(findStudentQuery, updateStudentQuery, function(err, result) {
//     //     if (err) throw err;
//     //     prevStudentName = result.name;
//     //     const win = new BrowserWindow({
//     //         title: "Here: " + prevStudentName,
//     //         width: 400,
//     //         height: 300,
//     //     });
//     //     // update student name of the tutor doc
//     //     studentCollection.findOne(findStudentQuery, function(err, updatedDoc) {
//     //         if (err) throw err;
//     //         if (updatedDoc.tutor_id.length > 0) {
//     //             try {
//     //                 tutorCollection.findOne({_id: ObjectId(updatedDoc.tutor_id)}, function(err, tutorDoc) {
//     //                     newStudentNames = tutorDoc.student_names;
//     //                     for (studentName in newStudentNames) {
//     //                         if (studentName === prevStudentName) {
//     //                             studentName = updatedDoc.name;
//     //                         }
//     //                     }
//     //                     tutorCollection.updateOne(
//     //                         { _id: ObjectId(updatedDoc.tutor_id) },
//     //                         { $set: {student_names: newStudentNames } },
//     //                     );
//     //                 });
//     //             } catch(err) {
//     //                 throw err;
//     //             }
//     //         }
//     //     });
//     //     // if tutor change, remove current tutor and add new tutor
//     // });
// });

