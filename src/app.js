import Koa from 'koa';
import api from './api';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import cors from 'kcors';
import KoaRouter from 'koa-router';

const isProduction = process.env.NODE_ENV === "production";

const home = KoaRouter();
home.get('/', async (ctx, next) => {
  ctx.body = "Hello World";
});

const app = new Koa()
  .use(cors())
  .use(json({ pretty: !isProduction }))
  .use(bodyParser())
  .use(home.routes())
  .use(home.allowedMethods())
  .use(api.routes())
  .use(api.allowedMethods());

export default app;