const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

var https = require('https');
var http = require('http');
var fs = require('fs');

var options = {
    key: fs.readFileSync('cert2/key.pem'),
    cert: fs.readFileSync('cert2/cert.pem'),
    passphrase: 'vishav'
  };

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
    res.send('Hello World from GCE!'); 
 });


app.get('/uploadfile/:id', function (req, res) {
    res.sendFile(__dirname + "/index.html");
 });


app.post('/upload', async (req, res) => {
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


            // Checking File Size (Max Size - 1MB)
            if(avatar.size > 5242880){

        
                return res.send({
                    status: 413,
                    message: 'file size greater than 5mb'
                });
            }
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv(`./uploads/${id}/` + avatar.name);
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


http.createServer(app).listen(3000, () => 
console.log('App is listening on port 3000'));
https.createServer(options, app).listen(4000, () => 
console.log('App is listening on port 4000'));

// app.listen(port, () => 
//   console.log(`App is listening on port ${port}.`)
// );