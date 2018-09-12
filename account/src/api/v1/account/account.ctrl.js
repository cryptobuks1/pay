const Account = require('db/models/Account');
const { Types: { ObjectId } } = require('mongoose');
const shortid = require('shortid');
const sendMail = require('lib/sendMail');

const { CryptoAES } = require('lib/CryptoKey');
const { decryptAES } = CryptoAES;

const ctxError = (ctx, status, msg) => {
  ctx.status = status;
  ctx.body = {
    error: msg
  };
};

const pakagePublic = (account) => {
  const pkg = {
    _id: account._id,
    email: account.email,
    nick: account.nick,
    level: account.level,

    address: account.address,
    status: account.status,
    msgCnt: account.msgCnt,
    cToken: account.cToken,

    amounts: account.GetAmounts()
  };
  return pkg;
};

const pakagePrivate = (account) => {
  const pkg = {
    _id: account._id,
    email: account.email,
    nick: account.nick,
    level: account.level,

    wif: decryptAES(account.wif),
    address: account.address,
    status: account.status,
    msgCnt: account.msgCnt,
    cToken: account.cToken,

    amounts: account.GetAmounts()
  };
  return pkg;
};

exports.register = async (ctx) => {
  const {email, pw, nick, level} = ctx.request.body;

  try {
    const exists = await Account.findOne({email}).exec();
    if(exists) {
      ctxError(ctx, 500, 'Already registered.');
      return;
    }

    const account = await Account.register({
      email, 
      pw, 
      nick, 
      level});

    ctx.body = pakagePublic(account);
    
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.patchUpdate = async (ctx) => {
  const { id } = ctx.params;
  
  if(!ObjectId.isValid(id)) {
    ctxError(ctx, 400, 'id error');
    return;
  }      
  if(ctx.request.body.pw || 
    ctx.request.body.amounts || 
    ctx.request.body.wif || 
    ctx.request.body.address) {
    ctxError(ctx, 400, 'This field can not be changed.');
    return;
  }
  
  try {
    const account = await Account.findByIdAndUpdate(id, ctx.request.body, {
      upsert: false,
      new: true
    }).exec();
  
    ctx.body = pakagePublic(account);
  } catch (e) {
    ctx.throw(e, 500);
  }
};  

exports.find = async (ctx) => {
  const {_id} = ctx.request.body;

  try {
    const account = _id ? await Account.findById(_id).exec() :
      await Account.findOne(ctx.request.body).exec();

    if(!account) {
      ctxError(ctx, 500, 'Data not found');
      return;
    }
    ctx.body = pakagePublic(account);
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.search = async (ctx) => {
  try {
    const accounts = await Account.find(ctx.request.body).exec();
    
    ctx.body = accounts.map(ac => pakagePublic(ac));

  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;
    
  if(!ObjectId.isValid(id)) {
    ctxError(ctx, 400, 'id error');
    return;
  }      
          
  try {
    await Account.remove({_id: id}).exec();
    ctx.body = { _id: id };

  } catch (e) {
    ctx.throw(e, 500);
  }
}; 

exports.login = async (ctx) => {
  const {email, pw} = ctx.request.body;
  
  if(!email || !pw) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      
      
  try {
    const account = await Account.findOne({email}).exec();
    if(!account) {
      ctxError(ctx, 500, 'Email not found');
      return;
    }
  
    const validated = account.validatePassword(pw);
    if(!validated) {
      ctxError(ctx, 500, 'password error');
      return;
    }
    ctx.body = {
      account: pakagePublic(account),
      key: account.GetSecurityKey()
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.newPassword = async (ctx) => {
  const {email, title} = ctx.request.body;

  if(!email) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      

  const pw = shortid.generate();
  const subject = !title ? 'NEW PASSWORD' : title;

  try {
    let account = await Account.findOne({email}).exec();
    if(!account) {
      ctxError(ctx, 500, 'Email not found');
      return;
    }      
    await sendMail({
      to: email,
      subject: subject,
      from: 'GENTRION <system@system.io>',
      body: `<div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
      <b style="black">안녕하세요! </b>새로이 발급된 비밀번호는 아래와 같습니다.
      </div>
    
      <div style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">비밀번호 : ${pw}</div>
    
      <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;"><div>기타 필요하신 사항이 있으시면<br/> 사이트 -> 문의로 접수 바랍니다.<br/></div><br/><div>감사합니다. </div></div>`
    });

    account.pw = account.GetPasswordHash(pw);
    await account.save();
    ctx.body = { 
      newpw: account.pw,
      result: 'success' 
    };

  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.changePassword = async (ctx) => {
  const {email, curPW, newPW} = ctx.request.body;

  if(email === undefined || 
    curPW === undefined || 
    newPW === undefined) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      
  
  try {
    let account = await Account.findOne({email}).exec();

    const validated = account.validatePassword(curPW);
    if(!validated) {
      ctxError(ctx, 400, 'password error');
      return;
    }

    account.pw = account.GetPasswordHash(newPW);
    await account.save();
    ctx.body = { 
      newpw: account.pw,
      result: 'success' 
    };

  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.getTransactionInfo = async (ctx) => {
  const {sender, recv, key} = ctx.request.body;
  if(!sender || !recv || !key) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      
  const parseSender = sender.indexOf('@') < 0 ? 
    { address: sender } : { email: sender };
  const parseRecv = recv.indexOf('@') < 0 ? 
    { address: recv } : { email: recv };

  try {
    const senderAccount = await Account.findOne(parseSender).exec();
    if(!senderAccount) {
      ctxError(ctx, 500, 'Sender not found');
      return;
    }
    if(!senderAccount.validateKey(key)) {
      ctxError(ctx, 500, 'Error Security key');
      return;
    }
    const toAccount = await Account.findOne(parseRecv).exec();
    if(!toAccount) {
      ctxError(ctx, 500, 'Recv not found');
      return;
    }      
    ctx.body = {
      sender: pakagePrivate(senderAccount),
      recv: pakagePrivate(toAccount)
    };
  } catch(e) {
    ctx.throw(e, 500);
  }
};

exports.detail = async (ctx) => {
  const {email, address, key} = ctx.request.body;
  if(!key || (!email && !address)) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      

  try {
    const account = await Account.findOne(
      email ? {email} : {address}
    ).exec();
    if(!account) {
      ctxError(ctx, 500, 'Data not found');
      return;
    }
    if(!account.validateKey(key)) {
      ctxError(ctx, 500, 'Error Security key');
      return;
    }

    ctx.body = pakagePrivate(account);
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.variationAmounts = async (ctx) => {
  const {infos} = ctx.request.body;
  if(!infos || (infos.length < 1)) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      

  try {
    for(const info of infos) {
      if(!info.address) continue;

      const account = await Account.findOne({
        address: info.address
      }).exec();

      if(account) {
        const index = account.tSym.findIndex(item => item === info.sym);
        if(index < 0) {
          account.tSym = [...account.tSym, info.sym];
          account.tAmount = [...account.tAmount, info.amount < 0 ? 0 : info.amount];
        } else {
          let tAmount = account.tAmount;
          const amount = tAmount[index] + info.amount;
          tAmount[index] = amount < 0 ? 0 : amount;
          account.tAmount = tAmount;
        }
        await account.save();
      }
    }
    ctx.body = { result: 'success' };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.updateAmounts = async (ctx) => {
  const {address, amounts} = ctx.request.body;
  if(!address || !amounts) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      

  try {
    const account = await Account.findOne({
      address
    }).exec();
    if(!account) {
      ctxError(ctx, 500, 'The address not found');
      return;
    }

    account.tSym = amounts.map(am => am.sym);
    account.tAmount = amounts.map(am => am.amount);
    await account.save();

    ctx.body = { result: 'success' };
  } catch (e) {
    ctx.throw(e, 500);
  }
};
