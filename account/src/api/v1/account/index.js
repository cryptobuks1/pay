const Router = require('koa-router');

const account = new Router();
const accountCtrl = require('./account.ctrl');

account.post('/register', accountCtrl.register);
account.patch('/update/:id', accountCtrl.patchUpdate);

account.post('/find', accountCtrl.find);
account.post('/search', accountCtrl.search);
account.post('/login', accountCtrl.login);
account.post('/newpw', accountCtrl.newPassword);
account.post('/chgpw', accountCtrl.changePassword);
account.post('/txinfo', accountCtrl.getTransactionInfo);

account.post('/detail', accountCtrl.detail);
account.post('/variation-amounts', accountCtrl.variationAmounts);
account.post('/set-amounts', accountCtrl.updateAmounts);

module.exports = account;