exports.getCurrentStamp = async function () {
    let ts = Date.now();
    let time = new Date(ts);
    let stamp = {};

    time.setMilliseconds(0);
    time.setSeconds(0);
    stamp.minutes = time.getTime();

    time.setMinutes(0);
    stamp.hours = time.getTime();

    time.setHours(0);
    stamp.days = time.getTime();

    return stamp;
}

exports.getPercent = async function (current, old) {
    let percent = (current * 100) / old - 100;
    return percent.toFixed(2);
}