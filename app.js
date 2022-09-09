const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const config = require('./config');
const { HTTP_PORT } = config.env;
const { filesize , audiosize, uploadfilepath, uploadaudiopath} = config.file;

var http = require('http');
var fs = require('fs');
var path = require('path')

// enable css and js
app.use(express.static(path.join(__dirname, '/public')));


// enable files upload
app.use(fileUpload({
    createParentPath: true,
}));

//add other middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.send('Hello there'); 
});


app.get('/uploadfile/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/file.html");
 });

app.get('/uploadaudio/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audio.html");
});

app.get('/uploadaudioeng/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audio1.html");
});

app.get('/uploadaudioengE14462/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audioE14462.html");
});

app.get('/uploadaudioDEE14462/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audioE14462DE.html");
});

app.get('/uploadaudiofr/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audiofrance.html");
});

app.get('/uploadaudioes/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audiospain.html");
});

app.get('/uploadaudioit/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audioitaly.html");
});

app.get('/uploadaudione/:projectName/:id', function (req, res) {
    res.sendFile(__dirname + "/audioneth.html");
});

app.post('/upload/file', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.file_upload;
            let id = req.body.userid;
            let projectName = req.body.projectName;

            projectName = (projectName === undefined) ? "default" : projectName;
            id = (id === undefined) ? "default" : id;

            // Checking File Size (Max Size - 5MB)
            if(avatar.size > filesize){
        
                return res.send({
                    status: 413,
                    message: 'file size greater than 5mb'
                });
            }
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            try {
                avatar.mv(`./upload/${projectName}`+uploadfilepath +`/${id}_` + avatar.name);
            } catch (error) {
                console.log(error);
                return res.send({
                    status: 413,
                    message: "file couldn't be uploaded"
                });
            }
            
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});



app.post('/upload/audio', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.file_upload;
            let id = req.body.userid;
            let projectName = req.body.projectName;

            projectName = (projectName === undefined) ? "default" : projectName;
            id = (id === undefined) ? "default" : id;


            // Checking File Size (Max Size - 5MB)
            if(avatar.size > audiosize){
        
                return res.send({
                    status: 413,
                    message: 'file size greater than 5mb'
                });
            }

            try {
                avatar.mv(`./upload/${projectName}`+uploadaudiopath +`/${id}_` + avatar.name);
            } catch (error) {
                console.log(error);
                return res.send({
                    status: 413,
                    message: "file couldn't be uploaded"
                });
            }
            
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

http.createServer(app).listen(HTTP_PORT, () => 
console.log(`HTTP App is listening on port ${process.env.HTTP_PORT}`));