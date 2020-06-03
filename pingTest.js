#!/usr/bin/env node
const keypress = require('keypress');
const ping = require('net-ping');
const { timeDiff } = require('./utils/time');

const HOST = '104.160.131.3';
const TIMEOUT = 500;

const options = {
    timeout: TIMEOUT
};
var maxTime = 0, minTime = TIMEOUT, serverErrors = 0, socketErrors = 0; tests = 0;
var errorTimes = [];
const startTime = Date.now();

const session = ping.createSession(options);
keypress(process.stdin);

const pinghost = function() {
    try {
        session.pingHost(HOST, function(err, target, reqTime, resTime) {
            var time = resTime - reqTime;
            if (time < minTime) minTime = time;
            if (time > maxTime) maxTime = time;
            if (err) {
                serverErrors++;
                errorTimes.push(reqTime);
                console.log(`Error received at ${resTime} from request at ${reqTime}.`);
            } else {
                console.log(`Pinged ${target} in ${time}ms.`);
            }
            tests++;
        });
    } catch(err) {
        const errorTime = Date.now();
        console.log(`Error pinging ${HOST} at ${errorTime}`);
        sockerErrors++;
        errorTimes.push(errorTime);
    }
}

setInterval(pinghost, 1000);

process.stdin.on('keypress', () => {
    const endTime = Date.now();
    console.log(`Ping tested from for ${timeDiff(new Date(startTime), new Date(endTime))}`)
    console.log(`Max ping: ${maxTime}ms.`);
    console.log(`Min ping: ${minTime}ms.`);
    console.log(`${socketErrors + serverErrors}/${tests} failed.`);
    console.log(`Socket errors (might be because of your computer or internet connection): ${socketErrors}.`);
    console.log(`Server errors (might be out of your control): ${serverErrors}.`);
    if (socketErrors || serverErrors) console.log('Errors occurred at:');
    errorTimes.forEach(time => console.log(time));
    session.close();
    process.exit();
});
