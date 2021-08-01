const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

const config = require('./config');
const { HTTP_PORT, HTTPS_PORT, KEY_FILE, CERT_FILE, PASS_PHRASE } = config.env;
const { filesize , audiosize, uploadfilepath, uploadaudiopath} = config.file;

var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path')

var options = {
    key: fs.readFileSync(KEY_FILE),
    cert: fs.readFileSync(CERT_FILE),
    passphrase: PASS_PHRASE
  };

// enable css and js
app.use(express.static(path.join(__dirname, '/public')));


// enable files upload
app.use(fileUpload({
    createParentPath: true,
    // limits: { 
    //     fileSize: 5242880 //5MB max file(s) size
    // }
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// to make file accessible like localhost://file
// app.use(express.static('uploads'));

app.get('/', function (req, res) {
    res.send('Hello there'); 
});


app.get('/uploadfile/:id', function (req, res) {
    res.sendFile(__dirname + "/file.html");
 });

app.get('/uploadaudio/:id', function (req, res) {
    res.sendFile(__dirname + "/audio.html");
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
            id = (id === undefined) ? "default" : id;


            // Checking File Size (Max Size - 5MB)
            if(avatar.size > filesize){
        
                return res.send({
                    status: 413,
                    message: 'file size greater than 5mb'
                });
            }
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv(uploadfilepath+`${id}/` + avatar.name);
            // avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                // data: {
                //     name: avatar.name,
                //     mimetype: avatar.mimetype,
                //     size: avatar.size
                // }
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
            id = (id === undefined) ? "default" : id;


            // Checking File Size (Max Size - 5MB)
            if(avatar.size > audiosize){
        
                return res.send({
                    status: 413,
                    message: 'file size greater than 5mb'
                });
            }
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv(uploadaudiopath+`${id}/` + avatar.name);
            // avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                // data: {
                //     name: avatar.name,
                //     mimetype: avatar.mimetype,
                //     size: avatar.size
                // }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//start app 
// const port = process.env.PORT || 3000;


http.createServer(app).listen(HTTP_PORT, () => 
console.log(`HTTP App is listening on port ${process.env.HTTP_PORT}`));
https.createServer(options, app).listen(HTTPS_PORT, () => 
console.log(`HTTPS App is listening on port ${process.env.HTTPS_PORT}`));

// app.listen(port, () => 
//   console.log(`App is listening on port ${port}.`)
// );