import KoaRouter from 'koa-router';
import { earthquakes } from './db';
import { findByCoords, all, single, nearby, find, getSingle } from './controllers/earthquakes';

const api = KoaRouter({ prefix: '/api/earthquakes' });

api.get('/', all);
api.get('/find', find);
api.get('/findByCoords', findByCoords);

api.get('/:id', getSingle, single);
api.get('/:id/nearby', getSingle, nearby);

export default api;