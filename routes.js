const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');

// http://localhost:3000/user if your server is running on port 3000

router.post('/', (req, res) => {
  const { firstName, lastName, email, marketingConsent } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const id = generateId(email);
  const accessToken = generateAccessToken(id);

  const stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?)');
  stmt.run(id, firstName, lastName, email, marketingConsent || false);
  stmt.finalize();

  res.status(201).json({ id, accessToken });
});

// http://localhost:3000/user/1a6ee41f58156b6881990457612aea0db15911af 
//after posting user with his id get the info 
router.get('/:id', (req, res) => {
  const id = req.params.id;

  const query = 'SELECT id, firstName, lastName, email, marketingConsent FROM users WHERE id = ?';
  db.get(query, id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!row.marketingConsent) {
      delete row.email;
    }

    res.json(row);
  });
});

function generateId(email) {
  // Generate the ID using SHA1 hash and salt
  const salt = '450d0b0db2bcf4adde5032eca1a7c416e560cf44';
  const emailHash = require('crypto').createHash('sha1').update(email + salt).digest('hex');
  return emailHash;
}

function generateAccessToken(userId) {
  // Generate a unique JWT token
  const secretKey = 'moShagb21'; // Replace with a strong secret key
  const expiration = Math.floor(Date.now() / 1000) + 3600; // Expires in 1 hour
  const token = jwt.sign({ sub: userId, exp: expiration }, secretKey);
  return token;
}

module.exports = router;
