import Monk from 'monk';

const db = Monk(process.env.MONGODB_URI || 'mongodb://heroku_k96dkx8n:hr0tkev5odebspdufqep94e2bm@ds135049.mlab.com:35049/heroku_k96dkx8n');

export const earthquakes = db.get('earthquakes');
export const imports     = db.get('imports');