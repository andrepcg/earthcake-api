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

export async function last(ctx, next) {
  const { collection, attribute, value } = ctx.params;

  ctx.body = {
    count: "last",
  };
}

export async function all(ctx, next) {
  const { collection, attribute, value } = ctx.params;

  ctx.body = {
    count: "all",
  };
}

export async function findByCoords(ctx, next) {
  const { lat, long, radius } = ctx.query;

  const results = await earthquakes.find(near([Number(lat), Number(long)], radius));

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

  const originalTime = new Date(earthquake.time);
  const fromTime = new Date(earthquake.time).setMinutes(originalTime.getMinutes() - 3)
  const toTime = new Date(earthquake.time).setMinutes(originalTime.getMinutes() + 3)

  if (same_time) {
    query = {
      ...query,
      time: {
        "$gte": new Date(fromTime),
        "$lte": new Date(toTime)
      }
    }
  }

  const res = await earthquakes.find(query);

  ctx.body = {
    data: res
  }
}