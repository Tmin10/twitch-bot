const TwitchBot = require('twitch-bot');
const open = require('open');
const readline = require('readline');
const config = require('./config');
var request = require('request');

var rl = readline.createInterface(process.stdin, process.stdout);

let authUrl = 'https://api.twitch.tv/kraken/oauth2/authorize' +
    '?client_id=' + config.clientId +
    '&redirect_uri=' + config.redirectUri +
    '&response_type=code' +
    '&scope=chat_login';

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
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                processToken(JSON.parse(body).access_token);
            } else {
                console.log(error, response);
            }
        }
    );
}

function processToken(token) {
    const Bot = new TwitchBot({
        username: config.userName,
        oauth: 'oauth:' + token,
        channel: config.channelName
    });

    Bot.on('join', () => {
        Bot.say('Command executed! PogChamp');
        Bot.on('message', chatter => {
            console.log(chatter);
            if(chatter.message === '!test') {
                Bot.say('Command executed! PogChamp')
            }
        })
    });

    Bot.on('error', err => {
        console.log(err)
    })
}
