const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
const config = require('./config.js');

const fetchOptions = { method : "Get" };
const apiTickersLists = "https://api.coingecko.com/api/v3/coins/bitcoin/tickers";
const apiTickersParams = "?exchange_ids=binance&order=volume_desc&page=";

const sql = mysql.createPool({
    host: config.sql.hostname,
    user: 'maxor',
    password: 'redroot',
    database: 'pump',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

getTickersFromAPI = async function (page) {
    try {
        let tLists = null;
        await fetch(apiTickersLists + apiTickersParams + page, fetchOptions).then(res => res.json()).then((json) =>  {
            tLists = json;
        });
        return tLists["tickers"];
    }
    catch (err) {
        console.error('[err] (sqlfunc.getTickersFromAPI) > ' + err);
        return 'err';
    }
}

exports.getTickersLists = async function () {
    try {
        let tickersLists = [];
        for (let i=0; i<10; i++) {
            let tickersPage = await getTickersFromAPI(i+1);
            if (tickersPage <= 0) {
                break;
            }
            else {
                for (let t=0; t<tickersPage.length; t++) {
                    if (tickersPage[t]["base"] != 'BTC') {
                        tickersLists.push(tickersPage[t]);
                    }
                }
            }
        }

        return tickersLists;
    }
    catch (err) {
        console.error('[err] (sqlfunc.buildTickersLists) > ' + err);
        return 'err';
    }
}

exports.registerTicker = async function (ticker, stamp) {
    let coin = ticker["base"];
    try {
        let query = "INSERT INTO tickers VALUE (0, ?, ?, ?, ?, ?)";
        let data = [
            ticker['base'],
            ticker['converted_volume']['usd'],
            stamp.days,
            stamp.hours,
            stamp.minutes
        ];
        await sql.query(query, data);
        return true;
    }
    catch (err) {
        console.error('[err] (sqlfunc.registerTicker) > ('+coin+')' + err);
        return 'err';
    }
}

exports.getSaveLastStamp = async function () {
    try {
        let query = "SELECT * FROM `tickers` ORDER BY `stamptime` DESC LIMIT 1";
        let result = await sql.query(query);
        result = result[0];

        if (result.length <= 0) {
            return 0;
        }
        else {
            return result[0]['stamptime'];
        }
    }
    catch (err) {
        console.error('[err] (sqlfunc.getSaveLastStamp) > ' + err);
        return 'err';
    }
}

exports.cleanTickersLists = async function (stamp) {
    try {
        let day = stamp[0];
        let rday = (((1000 * 60) * 60) * 24) * 3;
        let uday = day - rday;
        let query = "DELETE FROM tickers WHERE stampday < ?";
        let data = [uday];
        await sql.query(query, data);
        return true;
    }
    catch (err) {
        console.error('[err] (cleanTickersLists) > ' + err);
        return 'err';
    }
}