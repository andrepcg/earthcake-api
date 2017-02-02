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

api.get('/find',
  async (ctx, next) => {
    const { lat, long, radius } = ctx.query;
    // const count = await ctx
    //   .state
    //   .collections[collection]
    //   .add(ctx.request.body);
    //   
    
    const query = {
      geometry: {
        $near : {
          $geometry: {
            type: "Point",
            coordinates: [Number(lat), Number(long)]
          },
          $maxDistance: 2000
        }
      }
    }

    const results = await earthquakes.find(query);

    ctx.body = {
      results
    }
  });

export default api;