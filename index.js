const TwitchBot = require('twitch-bot');
const open = require('open');
const readline = require('readline');
const config = require('./config');
const request = require('request');
var camera = require("./webcam-integration");

var rl = readline.createInterface(process.stdin, process.stdout);

let authUrl = 'https://api.twitch.tv/kraken/oauth2/authorize' +
    '?client_id=' + config.clientId +
    '&redirect_uri=' + config.redirectUri +
    '&response_type=code' +
    '&scope=chat_login';

var Bot;
global.voters = new Map();
global.summary = {
	left: 0,
	right: 0,
	up: 0,
	down: 0,
	home: 0
}

console.log('Opening url: ' + authUrl);
open(authUrl);
rl.question('Please copy and paste url code here: ', (code) => {
    processCode(code);
});

function processCode(code) {
    let requestUrl = 'https://api.twitch.tv/kraken/oauth2/token' +
        '?client_id=' + config.clientId +
        '&client_secret=' + config.clientSecret +
        '&code=' + code +
        '&grant_type=authorization_code' +
        '&redirect_uri=http://localhost';
    request.post(
        requestUrl,
        {},
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                processToken(JSON.parse(body).access_token);
            } else {
                console.log(error, response);
            }
        }
    );
}

function processToken(token) {
    Bot = new TwitchBot({
        username: config.userName,
        oauth: 'oauth:' + token,
        channel: config.channelName
    });

    Bot.on('join', () => {
        Bot.say('Я подключился, давайте начинать! Управление камерой командами: up|down|left|right|home. Итоги подвожу каждую минуту!');
        console.log("Bot started");
		vote_start();
        Bot.on('message', chatter => {
            switch (chatter.message) {
                case "left":
                case "right":
                case "up":
                case "down":
                case "home":
					if (count_vote(chatter.message, chatter.user_id)) {
						Bot.say(chatter.display_name + ", засчитано!");
					}
					break;
            }
            //console.log(chatter);
        })
    });

    Bot.on('error', err => {
        console.log(err)
    })
}

function count_vote(vote, user) {
	if (global.voters.has(user)) {
		return false;
	} else {
		global.voters.set(user, vote);
		switch(vote) {
			case "left":
                global.summary.left++;
			break;
			case "right":
                global.summary.right++;
			break;
			case "up":
                global.summary.up++;
			break;
			case "down":
                global.summary.down++;
			break;
			case "home":
                global.summary.home++;
			break;
		}
		return true;
	}
}

function vote_start() {
    setInterval(move_camera, 60000);	
}

function move_camera() {
    if (global.voters.size === 0) {
        //left right up down home 0-4
        let move = getRandomInt(0, 4);
        let say = move_and_say(move);
        Bot.say("Никто не голосовал и я доверяю выбор Дерпи: двигаем камеру " +say + "!");
    } else {
        let max = Math.max(
            summary.left,
            summary.right,
            summary.up,
            summary.down,
            summary.home
        );
        let for_chose = [];
        if (summary.left === max) {
            for_chose.push(0);
        }
        if (summary.right === max) {
            for_chose.push(1);
        }
        if (summary.up === max) {
            for_chose.push(2);
        }
        if (summary.down === max) {
            for_chose.push(3);
        }
        if (summary.home === max) {
            for_chose.push(4);
        }
        let move = getRandomInt(0, for_chose.length);
        let say = move_and_say(for_chose[move]);
        Bot.say("Выбор сделан, двигаем камеру " + say +"!");
    }
    Bot.say("Управление камерой командами: up|down|left|right|home. Итоги подвожу каждую минуту!");
    
	global.voters = new Map();
	global.summary = {
		left: 0,
		right: 0,
		up: 0,
		down: 0,
		home: 0
	}
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function move_and_say(move) {
    let say;
    switch (move) {
        case 0:
            say = "влево";
            camera.moveLeft();
            break;
        case 1:
            say = "вправо";
            camera.moveRight();
            break;
        case 2:
            say = "вверх";
            camera.moveUp();
            break;
        case 3:
            say = "вниз";
            camera.moveDown();
            break;
        case 4:
            say = "в центр";
            camera.goHome();
            break;
    }
    return say;
}