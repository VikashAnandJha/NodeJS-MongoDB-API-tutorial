const express = require('express')
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

const Notes = require('./models/NotesModel');
const UserModel = require('./models/UsersModel')

const app = express()
const PORT = 3000

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb+srv://vikashjha_demo:jhajha22@brollet.168kf.mongodb.net/notes_db")

    console.log("DB connected successfully!")

}





app.listen(PORT, () => {
    console.log("running successfully at " + PORT)
})

app.get('/', (req, resp) => {

    resp.json({ success: true })


})
//signup route

app.post('/signup', async (req, resp) => {

    let data = {}
    data.email = req.body.email;
    data.password = req.body.password;
    data.name = req.body.name;
    data.createdAt = new Date();
    data.uid = uuidv4();

    await UserModel.findOne({ email: data.email }).then((docs) => {
        if (docs == null) {
            const user = new UserModel(data)
            let result = user.save();
            console.log("user is saved")
            resp.json({ success: true, msg: "User Registered successfully" })

        } else {
            resp.json({ success: false, msg: "User is already Registered" })
        }
    })
        .catch((err) => {
            console.log(err);
            resp.json({ success: false, msg: "unknown error" })
        });






})

//user login api

app.post('/login', async (req, resp) => {
    let data = {}
    data.email = req.body.email;
    data.password = req.body.password;

    await UserModel.findOne({ email: data.email, password: data.password }).then(async (docs) => {
        if (docs == null) {


            resp.json({ success: false, msg: "Invalid email or password" })

        } else {

            let response = docs;
            response.password = "*****";
            let token = uuidv4();
            response.token = token;
            await UserModel.updateOne({ email: data.email }, { token: token })


            resp.json({ success: true, msg: "User is found", data: response })
        }
    })
        .catch((err) => {
            console.log(err);
            resp.json({ success: false, msg: "unknown error" })
        });


})

//user profile api
app.get('/profile', async (req, resp) => {
    let token = req.query.token;

    await UserModel.findOne({ token }).then(async (docs) => {
        if (docs == null) {


            resp.json({ success: false, msg: "Invalid token" })

        } else {

            let response = docs;
            response.password = "*****";




            resp.json({ success: true, msg: "User is found", data: response })
        }
    })
        .catch((err) => {
            console.log(err);
            resp.json({ success: false, msg: "unknown error" })
        });


})

// create note

app.post('/create', async (req, resp) => {
    let data = {}
    data.title = req.body.title
    data.content = req.body.content
    data.createdAt = new Date();
    let token = req.body.token

    await UserModel.findOne({ token }).then(async (docs) => {
        if (docs != null) {

            data.uid = docs.uid


            const notes = new Notes(data)
            notes.save()
            resp.json({ success: true, msg: "note saved" })

        } else {
            resp.json({ success: false, msg: "invalid user or invalid token" })
        }
    });


    console.log(data)
})

// edit notes api

app.post('/edit', async (req, resp) => {
    let data = {}
    data.title = req.body.title
    data.content = req.body.content

    data.updatedAt = new Date();
    let token = req.body.token
    let note_id = req.body.note_id

    await UserModel.findOne({ token }).then(async (docs) => {
        if (docs != null) {

            data.uid = docs.uid

            await Notes.findOneAndUpdate({ _id: note_id }, data).then(async (docs) => {
                if (docs == null) {
                    resp.json({ success: false, msg: "save error" })
                }
                else {
                    resp.json({ success: true, msg: "note updated" })
                }

            })




            // resp.json({ success: true, msg: "note saved" })

        } else {
            resp.json({ success: false, msg: "invalid user or invalid token" })
        }
    });


    console.log(data)
})

// list all notes

// list note by id











