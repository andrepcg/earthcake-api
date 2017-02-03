import fetch from 'node-fetch';
import { earthquakes, imports } from './db';

const api_url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

function exit() {
  process.exit(0);
}

fetch(api_url)
  .then(res => res.json())
  .then(async (json) => {
    const lastImport = await imports.findOne({}, { sort: { generated: -1 } });
    if (!lastImport || json.metadata.generated !== lastImport.generated) {
      const eventsArray = [];

      json.features.map((event) => {
        eventsArray.push({
          id: event.id,
          ...event.properties,
          // time: Date(event.time),
          // updated: Date(event.updated),
          geometry: {
            type: event.geometry.type,
            coordinates: [event.geometry.coordinates[0], event.geometry.coordinates[1]]
          },
          depth: event.geometry.coordinates[2],
          ids: event.properties.ids.split(",").filter(Boolean),
          types: event.properties.types.split(",").filter(Boolean),
          sources: event.properties.sources.split(",").filter(Boolean),
        });
      });

      await earthquakes.insert(eventsArray, { continueOnError: true });
      await imports.insert(json.metadata);
      console.log("Data imported");
    }
  })
  .catch(err => console.error(err))
  .then(exit);