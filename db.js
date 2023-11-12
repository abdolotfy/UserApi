const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE users (id TEXT PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, marketingConsent INTEGER)');
});

module.exports = db;
