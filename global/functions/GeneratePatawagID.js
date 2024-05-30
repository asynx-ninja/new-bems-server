const moment = require('moment');

const GeneratePatawagID = (count) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    return `${moment().year()}-${zeroPad(count, 4)}`
};

module.exports = GeneratePatawagID;
