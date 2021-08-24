var config = {};
config.env={};
config.file={};

// set default values
config.file.filesize = '5242880';
config.file.audiosize = '5242880';
config.file.uploadfilepath = '/files';
config.file.uploadaudiopath = '/audios';


const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
    throw result.error;
}
const { parsed: envs } = result;
config.env = envs;
module.exports = config;