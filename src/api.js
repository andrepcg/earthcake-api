import KoaRouter from 'koa-router';
import { earthquakes } from './db';
import { findByCoords, all, single, nearby, find } from './controllers/earthquakes';

const api = KoaRouter({ prefix: '/api/earthquakes' });


async function getSingle(ctx, next) {
  const { id } = ctx.params;
  const earthquake = await earthquakes.findOne({ id });

  if (!earthquake) {
    ctx.body = {
      error: "No earthquake with that ID"
    };
  }
  else {
    ctx.earthquake = earthquake;
    await next();
  }
}

api.get('/', all);
api.get('/find', find);
api.get('/findByCoords', findByCoords);

api.get('/:id', getSingle, single);
api.get('/:id/nearby', getSingle, nearby);

export default api;