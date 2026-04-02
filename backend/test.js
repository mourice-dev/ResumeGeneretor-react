import db from './config/db.js'; db.query('SELECT NOW()').then(console.log).catch(console.error); 
