const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog, webContents, ipcRenderer} = require('electron');
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const sqlite3 = require('sqlite3');
const idRegex = /^[0-9a-fA-F]{24}$/;
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const globalClient = {};

const MONGO_CLUSTER_ADDRESS = "" // "@databasename..."

// Creates main window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Application',
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
        title: 'Application Log In',
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
    const uri = `mongodb+srv://${username}:${password}` + MONGO_CLUSTER_ADDRESS;
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
    var tutorCollection = globalClient.property.db("database").collection("Tutors");

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
    var studentCollection = globalClient.property.db("database").collection("Students");
    var tutorCollection = globalClient.property.db("database").collection("Tutors");

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
    var tutorCollection = globalClient.property.db("database").collection("Tutors");
    
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
    var studentCollection = globalClient.property.db("database").collection("Students");

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
    var tutorCollection = globalClient.property.db("database").collection("Tutors");
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
    var studentCollection = globalClient.property.db("database").collection("Students");

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
    var tutorCollection = globalClient.property.db("database").collection("Tutors");
    var studentCollection = globalClient.property.db("database").collection("Students");

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
    var tutorCollection = globalClient.property.db("database").collection("Tutors");
    var studentCollection = globalClient.property.db("database").collection("Students");

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

