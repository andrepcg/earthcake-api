import { earthquakes } from '../db';

const near = (coordinates, radius = 2000) => ({
  geometry: {
    $near : {
      $geometry: {
        type: "Point",
        coordinates: coordinates
      },
      $maxDistance: Number(radius)
    }
  }
});


export async function all(ctx, next) {
  const { collection, attribute, value } = ctx.params;

  const results = await earthquakes.find({}, { fields: { id: 1, place: 1, mag: 1, time: 1, geometry: 1 } });

  ctx.body = {
    data: results
  };
}

export async function findByCoords(ctx, next) {
  const { lat, long, radius } = ctx.query;

  const results = await earthquakes.find(
    near([Number(lat), Number(long)], radius),
    { fields: { id: 1, place: 1, mag: 1, time: 1, geometry: 1 } }
  );

  ctx.body = {
    data: results
  }
}

export async function find(ctx, next) {
  const { type, magType, types, sources, ids, code, net, tsunami, status, felt, since, until } = ctx.query;

  const query = {};
  if (type)    query.type = type;
  if (magType) query.magType = magType;
  if (code)    query.code = code;
  if (net)     query.net = net;
  if (tsunami) query.tsunami = tsunami;
  if (status)  query.status = status;
  if (felt)    query.felt = felt;
  if (types)   query.types = { $in: [types] };
  if (sources) query.sources = { $in: [sources] };
  if (ids)     query.ids = { $in: [ids] };

  if (since && !until)  query.time = { $gte: Number(since) };
  if (!since && until)  query.time = { $lte: Number(until) };
  if (since && until)   query.time = { $gte: Number(since), $lte: Number(until) };

  console.log(query)

  const results = await earthquakes.find(query, { fields: { id: 1, place: 1, mag: 1, time: 1, geometry: 1 } });

  ctx.body = {
    data: results
  }
}

export async function single(ctx, next) {
  const { earthquake } = ctx;

  ctx.body = {
    data: earthquake
  }
}

export async function nearby(ctx, next) {
  const { radius = 2000, same_time = false } = ctx.query;
  const { earthquake } = ctx;

  let query = near(earthquake.geometry.coordinates, radius);

  const originalTime = earthquake.time;

  if (same_time) {
    query = {
      ...query,
      time: {
        "$gte": originalTime - 300 * 1000,
        "$lte": originalTime + 300 * 1000
      }
    }
  }

  const res = await earthquakes.find(query, { fields: { id: 1, place: 1, mag: 1, time: 1, geometry: 1 } });

  ctx.body = {
    data: res
  }
}
