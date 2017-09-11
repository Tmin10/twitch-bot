const TwitchBot = require('twitch-bot')
const open = require('open')
const readline = require('readline')
const config = require('./config')

var rl = readline.createInterface(process.stdin, process.stdout);

let authUrl = 'https://api.twitch.tv/kraken/oauth2/authorize' +
    '?client_id=' + config.clientId +
    '&redirect_uri=' + config.redirectUri +
    '&response_type=code' +
    '&scope=chat_login';

console.log('Oppening url: ' + authUrl);
open(authUrl);
rl.question('Please copy and paste url code here: ', (code) => {
    processCode(code);
});

function processCode(code) {

}

const Bot = new TwitchBot({
    username: 'Kappa_Bot',
    oauth: 'oauth:dwiaj91j1KKona9j9d1420',
    channel: 'twitch'
})

Bot.on('join', () => {
    Bot.on('message', chatter => {
        console.log(chatter)
        if(chatter.message === '!test') {
            Bot.say('Command executed! PogChamp')
        }
    })
})
 
Bot.on('error', err => {
    console.log(err)
})
