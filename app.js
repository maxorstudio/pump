// include require module
const sqlfunc = require('./includes/sqlfunc.js');
const mainfunc = require('./includes/mainfunc.js');
const botfunc = require('./includes/botfunc.js');

// define global var
let currentStamp = 0;
let timerMainInterval = null;

let saveRUN = false;
let updateVolumeRUN = false;
let updateFullRUN = false;

let saveTimer = (1000 * 60) * 5; // save current volume each 5 min
let saveLast = 0;

// save each ticker volume to database
async function saveTickersLists() {
    try {
        saveRUN = true;
        console.log('[sys] (saveTickersLists) > save tickers lists ...');

        tickersLists = await sqlfunc.getTickersLists();

        if (tickersLists.length <= 0) 
        throw 'tickers lists empty, can\'t saved';

        for (let i=0; i<tickersLists.length; i++) {
            await sqlfunc.registerTicker(tickersLists[i], currentStamp);
        }

        saveLast = currentStamp.minutes;
        console.log('[sys] (saveTickersLists) > tickers lists saved');
        saveRUN = false;
        return true;
    }
    catch (err) {
        console.error('[err] (app.saveTickersLists) > ' + err);
        saveRUN = false;
        return 'err';
    }
}

// main timer interval
async function onTimerMain() {
    currentStamp = await mainfunc.getCurrentStamp();
    let nextSave = Number(saveLast) + Number(saveTimer);
  
    if (currentStamp.minutes > nextSave) {
        if (saveRUN  == false) {
            // saveTickersLists();
        }
    }

    return true;
}

// anit apps before stating run process
async function initApp() {
    console.log('[sys] (app.initApp) > system initialize ...');
    saveLast = await sqlfunc.getSaveLastStamp();
    console.log('[sys] (app.initApp) > system load from : ' + saveLast);
}

// entry point
async function run () {
    await initApp();
    timerMainProc = setInterval(onTimerMain, 1000);
}

// start apps
run();