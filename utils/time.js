const twoDigitNumber = num => num < 10 ? `0${num}` : num;

const timeDiff = (date1, date2) => {
    var diff = date2.getTime() - date1.getTime();

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    return `${twoDigitNum(hh)}h:${twoDigitNum(mm)}m:${twoDigitNum(ss)}s`;
}

module.exports = { timeDiff };
