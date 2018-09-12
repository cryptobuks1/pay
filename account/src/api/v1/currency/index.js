const Router = require('koa-router');

const currency = new Router();
const currencyCtrl = require('./currency.ctrl');

currency.post('/register', currencyCtrl.register);

currency.post('/find', currencyCtrl.find);
currency.post('/search', currencyCtrl.search);

module.exports = currency;