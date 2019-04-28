const { dev, isPro } = require('../env');
const baseConfig = require('../base');

const config = require(`./${dev}.config`);

module.exports = {
    dev,
    isPro,
    ...baseConfig,
    ...config
};
