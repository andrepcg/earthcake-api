import Koa from 'koa';
import api from './api';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import cors from 'kcors';

const isProduction = process.env.NODE_ENV === "production";

const app = new Koa()
  .use(cors())
  // .use(async (ctx, next) => {
  //   ctx.state.collections = config.collections;
  //   ctx.state.authorizationHeader = 'Key ' + config.key;
  //   await next();
  // })
  .use(json({ pretty: !isProduction }))
  .use(bodyParser())
  .use(api.routes())
  .use(api.allowedMethods());

export default app;