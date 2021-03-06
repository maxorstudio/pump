const gram = require('node-telegram-bot-api')
const config = require('./config.js');

const botToken = config.bot.token;
const bot = new gram(botToken, { polling: true });

async function botCommandStart(msg) {
    try {
        bot.sendMessage(msg.chat.id, "Welcome to Pump & Dump ALERT from MaxOR Studio, type /help to show the list of command");
    }
    catch (err) {
        console.error('[err] (botfunc.botMessageStart) > ' + err);
        return 'err';
    }
}

async function botCommandRegister(msg) {
    try {
        bot.sendMessage(msg.chat.id, "Welcome to Pump & Dump ALERT from MaxOR Studio, type /help to show the list of command");
    }
    catch (err) {
        console.error('[err] (botfunc.botMessageRegister) > ' + err);
        return 'err';
    }
}

async function botCommandHelp(msg) {
    try {
        bot.sendMessage(msg.chat.id, "Here the list of command you can use\n\n/start - show welcome message\n/register - create new account\n/unregister - delete your account\n/help - show this message again");
    }
    catch (err) {
        console.error('[err] (botfunc.botMessageHelp) > ' + err);
        return 'err';
    }
}

bot.on('message', async function (msg) {
    switch (msg.text) {
        case '/start' : await botCommandStart(msg); break;
        case '/register' : await botCommandRegister(msg); break;
        case '/help' : await botCommandHelp(msg); break;
    }
});