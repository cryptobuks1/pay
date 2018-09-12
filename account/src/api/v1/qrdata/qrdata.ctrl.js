const QRdata = require('db/models/QRdata');
const { Types: { ObjectId } } = require('mongoose');

const ctxError = (ctx, status, msg) => {
  ctx.status = status;
  ctx.body = {
    error: msg
  };
};
  
exports.register = async (ctx) => {
  const {email, address, sym, amount, memo} = ctx.request.body;
  if(email === undefined || 
    address === undefined || 
    sym === undefined || 
    amount === undefined || 
    memo === undefined
  ) {
    ctxError(ctx, 400, 'bad request (account)');
    return;
  }
  try {
    const qrdata = await QRdata.register({
      email, address, sym, amount, memo});
    
    ctx.body = qrdata;
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
  
  try {
    const qrdata = await QRdata.findByIdAndUpdate(id, ctx.request.body, {
      upsert: false,
      new: true
    }).exec();
  
    ctx.body = qrdata;
  } catch (e) {
    ctx.throw(e, 500);
  }
};  

exports.find = async (ctx) => {
  const {_id} = ctx.request.body;

  try {
    const qrdata = _id ? await QRdata.findById(_id).exec() :
      await QRdata.findOne(ctx.request.body).exec();
  
    if(!qrdata) {
      ctxError(ctx, 500, 'Data not found');
      return;
    }
    ctx.body = qrdata;
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
    await QRdata.remove({_id: id}).exec();
    ctx.body = { _id: id };
  } catch (e) {
    ctx.throw(e, 500);
  }
};