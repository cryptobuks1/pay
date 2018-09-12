const Currency = require('db/models/Currency');
const Account = require('db/models/Account');

const ctxError = (ctx, status, msg) => {
  ctx.status = status;
  ctx.body = {
    error: msg
  };
};

exports.register = async (ctx) => {
  const {name, sym, volume, email, key} = ctx.request.body;
  if(!name || !sym || !volume || !email || !key) {
    ctxError(ctx, 400, 'bad request');
    return;
  }      

  try {
    let account = await Account.findOne({email}).exec();
    if(!account) {
      ctxError(ctx, 500, 'email not found');
      return;
    }
    if(!account.validateKey(key)) {
      ctxError(ctx, 500, 'Error Security key');
      return;
    }
  
    const currency = await Currency.findOne({sym}).exec();
    if(currency) {
      if(currency.creatorEmail !== email) {
        ctxError(ctx, 500, 'Symbol already in use.');
        return;
      }
      ctx.body = await Currency.findByIdAndUpdate(currency._id, 
        {
          $inc: {volume: volume}
        }, 
        {
          upsert: false,
          new: true
        }).exec();
    } else {
      ctx.body = await Currency.register({
        name, 
        sym, 
        volume, 
        email,
        address: account.address
      });
    }

    const tindex = account.cToken.findIndex(tk => tk === sym);
    if(tindex < 0) {
      account.cToken = [...account.cToken, sym];
      await account.save();
    }

  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.find = async (ctx) => {
  try {
    const currency = await Currency.findOne(ctx.request.body).exec();

    if(!currency) {
      ctxError(ctx, 500, 'Data not found');
      return;
    }
    ctx.body = currency;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.search = async (ctx) => {
  try {
    const currencys = await Currency.find(ctx.request.body).exec();
    ctx.body = currencys;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
