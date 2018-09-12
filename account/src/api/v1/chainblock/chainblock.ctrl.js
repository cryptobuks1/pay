const ChainBlock = require('db/models/ChainBlock');

const ctxError = (ctx, status, msg) => {
  ctx.status = status;
  ctx.body = {
    error: msg
  };
};

exports.register = async (ctx) => {
  const {index, hash, data} = ctx.request.body;
  if(index === undefined ||
    hash === undefined ||
    data === undefined) {
    ctxError(ctx, 400, 'bad request');
    return;
  }

  try {
    const exists = await ChainBlock.findOne({index}).exec();
    if(exists) {
      ctxError(ctx, 500, 'Already registered.');
      return;
    }

    await ChainBlock.register({
      index, 
      hash, 
      data
    });

    ctx.body = {index};
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.find = async (ctx) => {
  const {_id} = ctx.request.body;

  try {
    const chainblock = _id ? await ChainBlock.findById(_id).exec() :
      await ChainBlock.findOne(ctx.request.body).exec();

    if(!chainblock) {
      ctxError(ctx, 500, 'Data not found');
      return;
    }
    ctx.body = chainblock;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.search = async (ctx) => {
  try {
    const chainblocks = await ChainBlock.find(ctx.request.body).sort({index: 1}).exec();
    
    ctx.body = chainblocks;

  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.last = async (ctx) => {
  try {
    const chainblocks = await ChainBlock.find({}).sort({index: -1}).limit(1).exec();
    ctx.body = chainblocks;
  } catch(e) {
    ctx.throw(e, 500);
  }
};
