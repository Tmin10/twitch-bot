const BASE_PATH = require("./config").cameraBasePath;
const LOGIN = require("./config").cameraLogin;
const PASSWORD = require("./config").cameraPassword;
const TIMEOUT = 1000;
const request = require('request');

exports.moveLeft = () => {
    cameraMove("left");
}

exports.moveRight = () => {
    cameraMove("right");
}

exports.moveUp = () => {
    cameraMove("up");
}

exports.moveDown = () => {
    cameraMove("down");
}

exports.goHome = () => {
    cameraSend("home");
}

exports.VScan = () => {
    cameraSend("vscan");
}

exports.HScan = () => {
    cameraSend("hscan");
}

function cameraMove(direction) {
    console.log("Camera move:" + direction);
    cameraSend(direction);
    cameraStop();
}

function cameraSend(command) {
    let options = {
        method: 'POST',
        uri: BASE_PATH + command,
        auth: {
            user: LOGIN,
            pass: PASSWORD,
            sendImmediately: false
        },
        headers: {
            'User-Agent': 'twitch-bot'
        }
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('body : ' + body)
        } else {
            if (response) {
                console.log('Code : ' + response.statusCode)
            }
            console.log('error : ' + error)
            console.log('body : ' + body)
        }
    });
}

function cameraStop() {
    setTimeout(() => cameraSend("stop"), TIMEOUT);
}
