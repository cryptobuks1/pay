const Account = require('db/models/Account');

const { 
  SYSTEM_ACCOUNT_EMAIL,
  SYSTEM_ACCOUNT_PASSWORD } = process.env;

exports.checkSysAdmin = async () => {
  try {
    const exists = await Account.findOne({email: SYSTEM_ACCOUNT_EMAIL}).exec();
    if(exists) return;

    // create system account
    await Account.register({
      email: SYSTEM_ACCOUNT_EMAIL, 
      pw: SYSTEM_ACCOUNT_PASSWORD, 
      nick: 'system', 
      level: 'system'
    });
    console.log('checked system account.');
  } catch (e) {
    console.log('#ERROR:checkSysAdmin, ' + e);
  }
};