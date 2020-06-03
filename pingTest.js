#!/usr/bin/env node
const keypress = require('keypress');
const ping = require('net-ping');
const { timeDiff } = require('./utils/time');

const HOST = '104.160.131.3';
const TIMEOUT = 500;

const options = {
    timeout: TIMEOUT
};
var maxTime = 0, minTime = TIMEOUT, serverErrors = 0, socketErrors = 0; tests = 0, pingSum = 0;
var errorTimes = [];
const startTime = Date.now();

const session = ping.createSession(options);
session.on('error', function() {
    const errorTime = Date.now();
    console.log(`Error pinging ${HOST} at ${new Date(errorTime).toUTCString()}`);
    socketErrors++;
    errorTimes.push(errorTime);
});

keypress(process.stdin);

const pinghost = function() {
    session.pingHost(HOST, function(err, target, reqTime, resTime) {
        var time = resTime - reqTime;
        pingSum += time;
        if (time < minTime) minTime = time;
        if (time > maxTime) maxTime = time;
        if (err) {
            serverErrors++;
            errorTimes.push(reqTime);
            console.log(`Error received at ${new Date(resTime).toUTCString()} from request at ${new Date(reqTime).toUTCString()}`);
        } else {
            console.log(`Pinged ${target} in ${time}ms`);
        }
        tests++;
    });
}

setInterval(pinghost, 1000);

process.stdin.on('keypress', () => {
    const endTime = Date.now();
    console.log(`Ping tested from for ${timeDiff(new Date(startTime), new Date(endTime))}`)
    console.log(`Max ping: ${maxTime}ms.`);
    console.log(`Min ping: ${minTime}ms.`);
    console.log(`Average ping: ${Math.round((pingSum * 100) / tests) / 100}ms.`);
    console.log(`${socketErrors + serverErrors}/${tests} failed.`);
    console.log(`Socket errors (might be because of your computer or internet connection): ${socketErrors}.`);
    console.log(`Server errors (might be out of your control): ${serverErrors}.`);
    if (socketErrors || serverErrors) console.log('Errors occurred at:');
    errorTimes.forEach(time => console.log(time));
    session.close();
    process.exit();
});
