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
                "Authorization" : 'Digest username="max", realm="IPCamera Login", nonce="1d20ca24224b4ebfbcbfd5aef66e0629", uri="/hy-cgi/ptz.cgi?cmd=ptzctrl&act=home", response="a57e6f12127fa6903327045c3130b374", qop=auth, nc=00000006, cnonce="ca60d66b9086b652"',
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:55.0) Gecko/20100101 Firefox/55.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Cookie": "language=english",
                "Connection": "keep-alive",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"

            }
        },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.log(response.statusCode);
                console.log(error, body);
            }
        }
    );
    // var digestRequest = require('request-digest')('max', 'equestria');
    // digestRequest.request(
    //     {
    //         host: 'http://dimaaannn.asuscomm.com',
    //         path: '/hy-cgi/ptz.cgi?cmd=ptzctrl&act=' + command,
    //         port: 8100,
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