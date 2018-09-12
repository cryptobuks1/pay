const Router = require('koa-router');

const chainblock = new Router();
const chainblockCtrl = require('./chainblock.ctrl');

chainblock.post('/register', chainblockCtrl.register);
chainblock.post('/find', chainblockCtrl.find);
chainblock.post('/search', chainblockCtrl.search);
chainblock.get('/last', chainblockCtrl.last);

module.exports = chainblock;