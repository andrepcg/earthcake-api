import KoaRouter from 'koa-router';
import { earthquakes } from './db';

const api = KoaRouter({ prefix: '/api/earthquakes' });

api.get('/day',
  async (ctx, next) => {
    const { collection, attribute, value } = ctx.params;

    // const count = await ctx
    //   .state
    //   .collections[collection]
    //   .countBy(attribute, value);

    ctx.body = {
      count: 123,
    };
  });

api.post('/:collection',
  async (ctx, next) => {
    const { collection } = ctx.params;
    const count = await ctx
      .state
      .collections[collection]
      .add(ctx.request.body);

    ctx.status = 201;
  });

export default api;