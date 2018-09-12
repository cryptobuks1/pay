// load environment variables
require('dotenv').config();

process.env.TZ = 'Asia/Seoul';

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');

const db = require('./db');

const api = require('./api');
const jwtMiddleware = require('lib/middlewares/jwt');
const initialize = require('lib/initialize');

db.connect();
const app = new Koa();

app.use((ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-timebase, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Link');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT, OPTIONS');
  ctx.set('Access-Control-Expose-Headers', 'Link');
  return next();
});
// Access-Control-Max-Age: 3600

app.use(compress());

app.use(jwtMiddleware);
app.use(bodyParser());

const router = new Router();
router.use('/api', api.routes());

app.use(router.routes());
app.use(router.allowedMethods());

initialize.checkSysAdmin();

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Account Server is listening to port ${process.env.PORT}`);
});