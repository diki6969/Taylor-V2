process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';

import {
    createRequire
} from "module";
import {
    join
} from 'path';
import path from 'path';
import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import {
    platform
} from 'process';
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

import * as ws from 'ws';
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
    watch
} from 'fs';
import fs from 'fs/promises';
import yargs from 'yargs';
import {
    spawn,
    exec
} from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import {
    tmpdir
} from 'os';
import chokidar from 'chokidar';
import {
    format,
    promisify
} from 'util';
import {
    Boom
} from "@hapi/boom";
import Pino from 'pino';
import {
    makeWaSocket,
    protoType,
    serialize
} from './lib/simple.js';
import {
    Low,
    JSONFile
} from 'lowdb';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';

const {
    DisconnectReason,
    useMultiFileAuthState,
    MessageRetryMap,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    proto,
    jidNormalizedUser,
    PHONENUMBER_MCC,
    Browsers
} = await (await import('@adiwajshing/baileys')).default;

import readline from "readline"
import {
    parsePhoneNumber
} from "libphonenumber-js"

import single2multi from './lib/single2multi.js';
import storeSystem from './lib/store-multi.js';
import Helper from './lib/helper.js';
import emojiRegex from 'emoji-regex';

const pairingCode = process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const useQr = process.argv.includes("--qr")
const singleToMulti = process.argv.includes("--singleauth")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
import NodeCache from "node-cache"
const msgRetryCounterCache = new NodeCache()
const {
    CONNECTING
} = ws
const {
    chain
} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
})) : '')
global.timestamp = {
    start: new Date
}

const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const symbolRegex = /^[^\w\s\d]/u;
const emojiAndSymbolRegex = new RegExp(`(${symbolRegex.source}|${emojiRegex().source})`, 'u');
global.prefix = emojiAndSymbolRegex;
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(async function() {
        if (!global.db.READ) {
            clearInterval(this)
            resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
        }
    }, 1 * 1000))
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(global.db.data || {})
    }
    global.db.chain = chain(global.db.data)
}
loadDatabase()
global.authFile = `TaylorSession`;

const msgRetryCounterMap = (MessageRetryMap) => {};
const {
    version
} = await fetchLatestBaileysVersion();

if (!pairingCode && !useMobile && !useQr && !singleToMulti) {
    const title = "OPTIONS";
    const message = "--pairing-code, --mobile, --qr, --singleauth";
    const boxWidth = 40;
    const horizontalLine = chalk.redBright("─".repeat(boxWidth));

    const formatText = (text, bgColor, textColor) => chalk[bgColor](chalk[textColor](text.padStart(boxWidth / 2 + text.length / 2).padEnd(boxWidth)));

    console.log(`╭${horizontalLine}╮
|${formatText(title, 'bgRed', 'white')}|
├${horizontalLine}┤
|${formatText(message, 'bgWhite', 'red')}|
╰${horizontalLine}╯`);
}

var authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ''}TaylorSession`)
var authFile = `${Helper.opts._[0] || 'session'}.data.json`

var [
    isCredsExist,
    isAuthSingleFileExist,
    authState
] = await Promise.all([
    Helper.checkFileExists(authFolder + '/creds.json'),
    Helper.checkFileExists(authFile),
    storeSystem.useMultiFileAuthState(authFolder)
])

var store = storeSystem.makeInMemoryStore()

// Convert single auth to multi auth
if (Helper.opts['singleauth'] || Helper.opts['singleauthstate']) {
    if (!isCredsExist && isAuthSingleFileExist) {
        console.debug(chalk.blue('- singleauth -'), chalk.yellow('creds.json not found'), chalk.green('compiling singleauth to multiauth...'));
        await single2multi(authFile, authFolder, authState);
        console.debug(chalk.blue('- singleauth -'), chalk.green('compiled successfully'));
        authState = await storeSystem.useMultiFileAuthState(authFolder);
    } else if (!isAuthSingleFileExist) console.error(chalk.blue('- singleauth -'), chalk.red('singleauth file not found'));
}

var storeFile = `${Helper.opts._[0] || 'data'}.store.json`
store.readFromFile(storeFile)

const connectionOptions = {
    ...(!pairingCode && !useMobile && !useQr && {
        printQRInTerminal: false,
        mobile: !useMobile
    }),
    ...(pairingCode && {
        printQRInTerminal: !pairingCode
    }),
    ...(useMobile && {
        mobile: !useMobile
    }),
    ...(useQr && {
        printQRInTerminal: true
    }),
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        ...message
                    }
                }
            };
        }
        return message;
    },
    msgRetryCounterMap,
    logger: Pino({
        level: 'fatal'
    }),
    auth: {
        creds: authState.state.creds,
        keys: makeCacheableSignalKeyStore(authState.state.keys, Pino().child({
            level: 'fatal',
            stream: 'store'
        })),
    },
    browser: ['Chrome (Linux)', '', ''],
    version,
    getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
    },
    msgRetryCounterCache,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true
};

global.conn = makeWaSocket(connectionOptions);
store.bind(conn.ev)
conn.isInit = false

if (pairingCode && !conn.authState.creds.registered) {
    if (useMobile) conn.logger.error('\nCannot use pairing code with mobile api')
    console.log(chalk.cyan('╭──────────────────────────────────────···'));
    console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
    console.log(chalk.cyan('├──────────────────────────────────────···'));
    let phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
    console.log(chalk.cyan('╰──────────────────────────────────────···'));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
        console.log(`💬 ${chalk.redBright("Start with your country's WhatsApp code, Example 62xxx")}:`);
        console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    }
    let code = await conn.requestPairingCode(phoneNumber)
    code = code?.match(/.{1,4}/g)?.join("-") || code
    console.log(chalk.cyan('╭──────────────────────────────────────···'));
    console.log(` 💻 ${chalk.redBright('Your Pairing Code')}:`);
    console.log(chalk.cyan('├──────────────────────────────────────···'));
    console.log(`   ${chalk.cyan('- Code')}: ${code}`);
    console.log(chalk.cyan('╰──────────────────────────────────────···'));
    rl.close()
}

if (useMobile && !conn.authState.creds.registered) {
    const {
        registration
    } = conn.authState.creds || {
        registration: {}
    }
    if (!registration.phoneNumber) {
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        let phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
            console.log(`💬 ${chalk.redBright("Start with your country's WhatsApp code, Example 62xxx")}:`);
            console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
            console.log(chalk.cyan('╭──────────────────────────────────────···'));
            console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
            console.log(chalk.cyan('├──────────────────────────────────────···'));
            phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
            console.log(chalk.cyan('╰──────────────────────────────────────···'));
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        }
        registration.phoneNumber = "+" + phoneNumber
    }

    const phoneNumber = parsePhoneNumber(registration.phoneNumber)
    if (!phoneNumber.isValid()) conn.logger.error('\nInvalid phone number: ' + registration.phoneNumber)
    registration.phoneNumber = phoneNumber.format("E.164")
    registration.phoneNumberCountryCode = phoneNumber.countryCallingCode
    registration.phoneNumberNationalNumber = phoneNumber.nationalNumber
    const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode]
    registration.phoneNumberMobileCountryCode = mcc
    async function enterCode() {
        try {
            console.log(chalk.cyan('╭──────────────────────────────────────···'));
            console.log(`📨 ${chalk.redBright('Please Enter Your OTP Code')}:`);
            console.log(chalk.cyan('├──────────────────────────────────────···'));
            const code = await question(`   ${chalk.cyan('- Code')}: `);
            console.log(chalk.cyan('╰──────────────────────────────────────···'));
            const response = await conn.register(code.replace(/[^0-9]/g, '').trim().toLowerCase())
            console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
            console.log(`💬 ${chalk.redBright("Successfully registered your phone number.")}`);
            console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
            console.log(response)
            rl.close()
        } catch (error) {
            conn.logger.error('\nFailed to register your phone number. Please try again.\n', error)
            await askOTP()
        }
    }

    async function askOTP() {
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(`📨 ${chalk.redBright('What method do you want to use? "sms" or "voice"')}`);
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        let code = await question(`   ${chalk.cyan('- Method')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        code = code.replace(/["']/g, '').trim().toLowerCase()
        if (code !== 'sms' && code !== 'voice') return await askOTP()
        registration.method = code
        try {
            await conn.requestRegistrationCode(registration)
            await enterCode()
        } catch (error) {
            conn.logger.error('\nFailed to request registration code. Please try again.\n', error)
            await askOTP()
        }
    }
    await askOTP()
}

conn.logger.info('\n🚩 W A I T I N G\n');

if (!opts['test']) {
    if (global.db) {
        setInterval(async () => {
            if (global.db.data) await global.db.write();
            if (opts['autocleartmp'] && (global.support || {}).find)(tmp = [os.tmpdir(), 'tmp', 'jadibot'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
        }, 30 * 1000);
    }
}

if (opts['server'])(await import('./server.js')).default(global.conn, PORT);

async function clearTmp() {
    try {
        const tmp = [tmpdir(), join(__dirname, "./tmp")];
        const filename = tmp.flatMap((dirname) =>
            readdirSync(dirname).filter((file) => {
                try {
                    const stats = statSync(join(dirname, file));
                    return stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 3;
                } catch (err) {
                    console.error(`Error reading stats for ${file}: ${err.message}`);
                    return false;
                }
            }).map((file) => {
                try {
                    unlinkSync(join(dirname, file));
                    console.log(chalk.cyanBright("Successfully clear tmp"));
                    return join(dirname, file);
                } catch (err) {
                    console.error(`Error unlinking ${file}: ${err.message}`);
                    return null;
                }
            })
        );
        return filename.filter((file) => file !== null);
    } catch (err) {
        console.error(`Error in clearTmp: ${err.message}`);
        return [];
    }
}

async function clearSessions(folder = "TaylorSession") {
    try {
        const filename = readdirSync(folder).filter((file) => {
            try {
                const stats = statSync(join(folder, file));
                return stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 120;
            } catch (err) {
                console.error(`Error reading stats for ${file}: ${err.message}`);
                return false;
            }
        }).map((file) => {
            try {
                unlinkSync(join(folder, file));
                console.log("Deleted sessions", join(folder, file));
                return join(folder, file);
            } catch (err) {
                console.error(`Error unlinking ${file}: ${err.message}`);
                return null;
            }
        });
        return filename.filter((file) => file !== null);
    } catch (err) {
        console.error(`Error in clearSessions: ${err.message}`);
        return [];
    }
}

async function purgeSession() {
    try {
        const prekeyFolder = './TaylorSession';
        const prekeyFiles = readdirSync(prekeyFolder).filter((file) => file.startsWith('pre-key-'));
        prekeyFiles.forEach((file) => {
            try {
                unlinkSync(join(prekeyFolder, file));
            } catch (err) {
                console.error(`Error unlinking ${file}: ${err.message}`);
            }
        });
    } catch (err) {
        console.error(`Error in purgeSession: ${err.message}`);
    }
}

async function purgeSessionSB() {
    try {
        const directories = ['./TaylorSession/', './jadibot/'];
        directories.forEach((folderPath) => {
            try {
                if (!existsSync(folderPath)) {
                    mkdirSync(folderPath);
                    conn.logger.info(`\nFolder ${folderPath} berhasil dibuat.`);
                }
                const listaDirectorios = readdirSync(folderPath);
                listaDirectorios.forEach((filesInDir) => {
                    const dirPath = join(folderPath, filesInDir);
                    const SBprekeyFiles = readdirSync(dirPath).filter((fileInDir) => fileInDir.startsWith('pre-key-'));
                    SBprekeyFiles.forEach((fileInDir) => {
                        try {
                            unlinkSync(join(dirPath, fileInDir));
                        } catch (err) {
                            console.error(`Error unlinking ${fileInDir}: ${err.message}`);
                        }
                    });
                });
            } catch (err) {
                console.error(`Error in purgeSessionSB: ${err.message}`);
            }
        });
    } catch (err) {
        console.error(`Error in purgeSessionSB: ${err.message}`);
    }
}

async function purgeOldFiles() {
    try {
        const directories = ['./TaylorSession/', './jadibot/'];
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        directories.forEach((dir) => {
            readdirSync(dir).forEach((file) => {
                try {
                    const filePath = join(dir, file);
                    const stats = statSync(filePath);
                    if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') {
                        unlinkSync(filePath);
                        conn.logger.info(`\nBerkas ${file} berhasil dihapus`);
                    } else {
                        conn.logger.warn(`\nBerkas ${file} tidak dihapus`);
                    }
                } catch (err) {
                    console.error(`Error processing ${file}: ${err.message}`);
                }
            });
        });
    } catch (err) {
        console.error(`Error in purgeOldFiles: ${err.message}`);
    }
}

async function connectionUpdate(update) {
    const {
        connection,
        lastDisconnect,
        isNewLogin,
        qr,
        isOnline,
        receivedPendingNotifications
    } = update;
    global.stopped = connection;
    if (isNewLogin) conn.isInit = true;
    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
    if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        conn.logger.info(await global.reloadHandler(true).catch(console.error));
    }
    if (global.db.data == null) loadDatabase();

    if (connection === "connecting") {
        console.log(
            chalk.redBright("⚡ Mengaktifkan Bot, Mohon tunggu sebentar...")
        );
    }
    if (connection === "open") {
        const {
            jid,
            name
        } = conn.user;
        const currentTime = new Date();
        const pingStart = new Date();
        const infoMsg = `*Bot Info:*
   
*Current Time:* ${currentTime}
*Name:* ${name || 'Taylor'}
*Tag:* @${jid.split('@')[0]}
*Ping Speed:* ${pingStart - new Date()}ms
*Date:* ${currentTime.toDateString()}
*Time:* ${currentTime.toLocaleTimeString()}
*Day:* ${currentTime.toLocaleDateString('id-ID', { weekday: 'long' })}
*Description:* Bot ${name || 'Taylor'} is now active.`;
        await conn.reply(
            nomorown + "@s.whatsapp.net",
            infoMsg,
            null, {
                contextInfo: {
                    mentionedJid: [nomorown + "@s.whatsapp.net", jid]
                },
            }
        );
        conn.logger.info(chalk.yellow('\n🚩 R E A D Y'));
    }
    if (isOnline == true) {
        conn.logger.info(chalk.green("Status Aktif"));
    }
    if (isOnline == false) {
        conn.logger.error(chalk.red("Status Mati"));
    }
    if (receivedPendingNotifications) {
        conn.logger.warn(chalk.yellow("Menunggu Pesan Baru"));
    }
    if (!pairingCode && !useMobile && !useQr && qr !== 0 && qr !== undefined && connection === "close") {
        conn.logger.error(chalk.yellow(`\n🚩 Koneksi ditutup, harap hapus folder ${global.authFile} dan pindai ulang kode QR`));
        // Kill previous processes and restart
        const killAndRestart = async (killCommand, restartCommand) => {
            try {
                await exec(killCommand);
                const {
                    stdout
                } = await exec(restartCommand);
                console.log(`Restarted successfully: ${stdout}`);
            } catch (err) {
                console.error(`Error: ${err.message}`);
            }
        };

        killAndRestart('pkill -f "node index.js"', `node index.js ${process.argv.slice(2).join(' ')}`);
    }
    if (!pairingCode && !useMobile && useQr && qr !== 0 && qr !== undefined && connection === "close") {
        conn.logger.info(chalk.yellow('\n🚩ㅤPindai kode QR ini, kode QR akan kedaluwarsa dalam 60 detik.'));
        // Kill previous processes and restart
        const killAndRestart = async (killCommand, restartCommand) => {
            try {
                await exec(killCommand);
                const {
                    stdout
                } = await exec(restartCommand);
                console.log(`Restarted successfully: ${stdout}`);
            } catch (err) {
                console.error(`Error: ${err.message}`);
            }
        };

        killAndRestart('pkill -f "node index.js"', `node index.js ${process.argv.slice(2).join(' ')}`);
    }
}

const logError = (eventType, message, details) => {
    console.error(`[AntiCrash] :: ${eventType}\n${message}:`, details);
};

const handleMultipleResolves = (type, promise, reason) => {
    if (!handleMultipleResolves.warned) {
        logError("Multiple Resolves", "Type", type);
        console.warn("Promise:", promise);
        console.warn("Reason:", reason);
        handleMultipleResolves.warned = true;
    }
};

process.on("unhandledRejection", (reason, p) => logError("Unhandled Rejection/Catch", "Reason", reason) && console.error("Promise:", p));
process.on("uncaughtException", (err, origin) => logError("Uncaught Exception/Catch", "Error", err) && console.error("Origin:", origin));
process.on("uncaughtExceptionMonitor", (err, origin) => logError("Uncaught Exception/Catch (MONITOR)", "Error", err) && console.error("Origin:", origin));

process.on("multipleResolves", handleMultipleResolves);
handleMultipleResolves.warned = false;

let isInit = true;
let handler = await import('./handler.js');
global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler;
    } catch (error) {
        console.error;
    }
    if (restatConn) {
        const oldChats = global.conn.chats;
        try {
            global.conn.ws.close();
        } catch {}
        conn.ev.removeAllListeners();
        global.conn = makeWaSocket(connectionOptions, {
            chats: oldChats
        });
        isInit = true;
    }
    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler);
        conn.ev.off('messages.update', conn.pollUpdate);
        conn.ev.off('group-participants.update', conn.participantsUpdate);
        conn.ev.off('groups.update', conn.groupsUpdate);
        conn.ev.off('message.delete', conn.onDelete);
        conn.ev.off("presence.update", conn.presenceUpdate);
        conn.ev.off('connection.update', conn.connectionUpdate);
        conn.ev.off('creds.update', conn.credsUpdate);
    }

    const emoji = {
        welcome: '👋',
        bye: '👋',
        promote: '👤👑',
        demote: '👤🙅‍♂️',
        desc: '📝',
        subject: '📌',
        icon: '🖼️',
        revoke: '🔗',
        announceOn: '🔒',
        announceOff: '🔓',
        restrictOn: '🚫',
        restrictOff: '✅',
    };

    conn.welcome = `${emoji.welcome} Hallo @user\n\n   *W E L C O M E*\n⫹⫺ Di grup @subject\n\n⫹⫺ Baca *DESKRIPSI*\n@desc`;
    conn.bye = `   *G O O D B Y E*\n${emoji.bye} Sampai jumpa @user`;
    conn.spromote = `*${emoji.promote} @user* sekarang menjadi admin!`;
    conn.sdemote = `*${emoji.demote} @user* tidak lagi menjadi admin!`;
    conn.sDesc = `${emoji.desc} Deskripsi telah diubah menjadi:\n@desc`;
    conn.sSubject = `${emoji.subject} Judul grup telah diubah menjadi:\n@subject`;
    conn.sIcon = `${emoji.icon} Icon grup telah diubah!`;
    conn.sRevoke = `${emoji.revoke} Link grup telah diubah ke:\n@revoke`;
    conn.sAnnounceOn = `${emoji.announceOn} Grup telah ditutup!\nSekarang hanya admin yang dapat mengirim pesan.`;
    conn.sAnnounceOff = `${emoji.announceOff} Grup telah dibuka!\nSekarang semua peserta dapat mengirim pesan.`;
    conn.sRestrictOn = `${emoji.restrictOn} Edit Info Grup diubah ke hanya admin!`;
    conn.sRestrictOff = `${emoji.restrictOff} Edit Info Grup diubah ke semua peserta!`;

    conn.handler = handler.handler.bind(global.conn);
    conn.pollUpdate = handler.pollUpdate.bind(global.conn);
    conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
    conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
    conn.onDelete = handler.deleteUpdate.bind(global.conn);
    conn.presenceUpdate = handler.presenceUpdate.bind(global.conn);
    conn.connectionUpdate = connectionUpdate.bind(global.conn);
    conn.credsUpdate = authState.saveCreds.bind(global.conn, true);

    const currentDateTime = new Date();
    const messageDateTime = new Date(conn.ev);
    if (currentDateTime >= messageDateTime) {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
    } else {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
    }

    conn.ev.on('messages.upsert', conn.handler);
    conn.ev.on("messages.update", conn.pollUpdate);
    conn.ev.on('group-participants.update', conn.participantsUpdate);
    conn.ev.on('groups.update', conn.groupsUpdate);
    conn.ev.on('message.delete', conn.onDelete);
    conn.ev.on("presence.update", conn.presenceUpdate);
    conn.ev.on('connection.update', conn.connectionUpdate);
    conn.ev.on('creds.update', conn.credsUpdate);

    isInit = false;
    return true;
};

global.plugins = {};
const pluginFilter = (filename) => /\.js$/.test(filename);

const require = createRequire(import.meta.url);
const glob = require('glob');

async function filesInit() {
    try {
        const pluginsDirectory = path.join(__dirname, 'plugins');
        const pattern = path.join(pluginsDirectory, '**/*.js');
        const CommandsFiles = await glob.sync(pattern);
        const successMessages = [];
        const errorMessages = [];

        for (let file of CommandsFiles) {
            const moduleName = '/' + path.relative(__dirname, file);
            try {
                const module = await import(file);
                global.plugins[moduleName] = module.default || module;
                successMessages.push(moduleName);
            } catch (e) {
                conn.logger.error(e);
                delete global.plugins[moduleName];
                errorMessages.push(moduleName);
            }
        }

        await conn.reply(nomorown + "@s.whatsapp.net", "*Loaded Plugins Report:*\n" +
            "\n*Total Plugins:* " + CommandsFiles.length +
            "\n*Success:* " + successMessages.length +
            "\n*Error:* " + errorMessages.length +
            "\n*Error List:*\n" + errorMessages.map((v, i) => (i + 1) + ". " + v).join('\n'), null);

        conn.logger.warn("Loaded " + CommandsFiles.length + " JS Files total.");
        conn.logger.info("✅ Success Plugins:\n" + successMessages.length + " total.");
        conn.logger.error("❌ Error Plugins:\n" + errorMessages.length + " total");
    } catch (e) {
        conn.logger.error(e);
    }
}

filesInit()
    .catch(console.error);

async function FileEv(type, file) {
    const filename = (file) => file.replace(/^.*[\\\/]/, "");
    console.log(file);
    try {
        switch (type) {
            case "add":
                conn.logger.info(`new plugin - '${file}'`);
                break;
            case "change":
            case "add":
                const module = await import(`${global.__filename(file)}?update=${Date.now()}`);
                global.plugins[file] = module.default || module;
                conn.logger.info(`updated plugin - '${file}'`);
                break;
            case "unlink":
                delete global.plugins[file];
                conn.logger.warn(`deleted plugin - '${file}'`);
                break;
            default:
                conn.logger.warn(`unhandled event type - '${type}' for file '${file}'`);
                break;
        }
    } catch (e) {
        conn.logger.error(`Error requiring plugin '${filename(file)}\n${e.toString()}'`);
    } finally {
        global.plugins = Object.fromEntries(
            Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        );
    }
}

async function watchFiles() {
    try {
        let watcher = chokidar.watch("plugins/**/*.js", {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            ignoreInitial: true,
            alwaysState: true,
        });

        watcher
            .on("add", async (path) => {
                try {
                    await FileEv("add", `./${path}`);
                } catch (err) {
                    console.error(`Error handling 'add' event for ${path}: ${err.message}`);
                }
            })
            .on("change", async (path) => {
                try {
                    await FileEv("change", `./${path}`);
                } catch (err) {
                    console.error(`Error handling 'change' event for ${path}: ${err.message}`);
                }
            })
            .on("unlink", async (path) => {
                try {
                    await FileEv("unlink", `./${path}`);
                } catch (err) {
                    console.error(`Error handling 'unlink' event for ${path}: ${err.message}`);
                }
            })
            .on("error", (error) => {
                console.error(`Chokidar error: ${error}`);
            });
    } catch (err) {
        console.error(`Error in watchFiles: ${err.message}`);
    }
}

watchFiles();

await global.reloadHandler();
async function _quickTest() {
    const test = await Promise.all([
        spawn('ffmpeg'),
        spawn('ffprobe'),
        spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        spawn('convert'),
        spawn('magick'),
        spawn('gm'),
        spawn('find', ['--version']),
    ].map((p) => {
        return Promise.race([
            new Promise((resolve) => {
                p.on('close', (code) => {
                    resolve(code !== 127);
                });
            }),
            new Promise((resolve) => {
                p.on('error', (_) => resolve(false));
            })
        ]);
    }));
    const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
    const s = global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find
    };
    Object.freeze(global.support);
}
const actions = [{
        func: clearTmp,
        message: '\nPenyegaran Tempat Penyimpanan Berhasil ✅'
    },
    {
        func: purgeSession,
        message: '\nSesi-Sesi Tersimpan Sudah Dihapus ✅'
    },
    {
        func: purgeSessionSB,
        message: '\nSesi-Sesi Sub-Bot Telah Dihapus ✅'
    },
    {
        func: purgeOldFiles,
        message: '\nBerkas Lama Telah Dihapus ✅'
    }
];

for (const action of actions) {
    setInterval(async () => {
        if (stopped === 'close' || !conn || !conn.user) return;
        await action.func();
        console.log(chalk.cyanBright(
            `\n╭───────────────────────────────────···\n│\n` +
            `│  ${action.message}\n│\n` +
            `╰───────────────────────────────────···\n`
        ));
    }, 60 * 60 * 1000);
}

function clockString(ms) {
    if (isNaN(ms)) return '-- Hari -- Jam -- Menit -- Detik';
    const units = [{
            label: 'Hari',
            value: Math.floor(ms / 86400000)
        },
        {
            label: 'Jam',
            value: Math.floor(ms / 3600000) % 24
        },
        {
            label: 'Menit',
            value: Math.floor(ms / 60000) % 60
        },
        {
            label: 'Detik',
            value: Math.floor(ms / 1000) % 60
        }
    ];
    return units.map(unit => `${unit.value.toString().padStart(2, '0')} ${unit.label}`).join(' ');
}

_quickTest().catch(console.error);