const Router = require('koa-router');

const qrdata = new Router();
const qrdataCtrl = require('./qrdata.ctrl');

qrdata.post('/register', qrdataCtrl.register);
qrdata.patch('/update/:id', qrdataCtrl.patchUpdate);

qrdata.post('/find', qrdataCtrl.find);
qrdata.get('/remove/:id', qrdataCtrl.delete);

module.exports = qrdata;