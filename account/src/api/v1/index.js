const Router = require('koa-router');

const account = require('./account');
const currency = require('./currency');
const qrdata = require('./qrdata');
const chainblock = require('./chainblock');

const api = new Router();

api.use('/account', account.routes());
api.use('/currency', currency.routes());
api.use('/qrdata', qrdata.routes());
api.use('/chainblock', chainblock.routes());

module.exports = api;