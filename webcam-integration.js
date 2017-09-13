const BASE_PATH = require("./config").cameraBasePath;
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
    cameraSend(direction);
    cameraStop();
}

function cameraSend(command) {
    request.post(
        {
            url : BASE_PATH+command,
            headers : {
            }
        },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.log(response.statusCode);
                console.log(error, body);
            }
        }
    );
    // var digestRequest = require('request-digest')('', '');
    // digestRequest.request(
    //     {
    //         host: '',
    //         path: '' + command,
    //         port: ,
    //         method: 'POST'
    //     },
    //     (error, response, body) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //         console.log(body);
    //     }
    // );
}

function cameraStop() {
    setTimeout(() => cameraSend("stop"), TIMEOUT);
}