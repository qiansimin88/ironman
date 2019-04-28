module.exports = {
    dev: process.env.RUN_MODE || 'develop',
    isPro: process.env.NODE_ENV === 'production'
};
