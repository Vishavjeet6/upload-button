var config = {};
config.env={};
config.file={};

// set default values
config.file.filesize = '5242880';
config.file.audiosize = '5242880';
config.file.uploadfilepath = './uploads/';
config.file.uploadaudiopath = './uploads/';


const dotenv = require('dotenv');
const result = dotenv.config();
// const result = dotenv.config({ path: `.env.${process.env. NODE_ENV}` });
if (result.error) {
    throw result.error;
}
const { parsed: envs } = result;
config.env = envs;
// console.log(envs);
module.exports = config;