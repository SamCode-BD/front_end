require('dotenv').config({ path: '.env.development' });
const { applyRateLimit } = require('./src/lib/rateLimiter.js');
const { captchaHandler } = require('./src/lib/captchaHandler.js');

const { sendVerificationEmail } = require('./src/lib/emailVerificationHandler.js');

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3001;

// Use environment variable for SECRET_KEY
const SECRET_KEY = process.env.JWT_SECRET || 'SecretKey';

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST, // Use environment variables for sensitive information
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// -------------------- AUTH ROUTES --------------------

// Register new user
app.post('/api/register', async (req, res) => {
  try {

    await captchaHandler(req, res); //returns error message
    await applyRateLimit(req, res); //returns error message

    const { name, email, password, roles } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO user (name, email, password, roles, isVerified) VALUES (?, ?, ?, ?, FALSE)',
      [name, email, hashed, roles || 'user'],
      async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const newUser = { id: result.insertId, email };
        try {
          await sendVerificationEmail(newUser);

          return res.status(201).json({
            message: 'Account created. Please check your email to verify your account.',
            id: result.insertId,
            name,
            email,
            roles,
          });
        } catch (emailErr) {
          console.error('Email send error:', emailErr);
          return res.status(500).json({ error: 'Account created, but failed to send verification email.' });
        }
      }
    );
  } catch (err) {
      return;
  }
});

app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send('Missing token');

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_JWT_SECRET);

    db.query(
      'UPDATE user SET isVerified = true WHERE user_id = ?',
      [decoded.id],
      (err, result) => {
        if (err) return res.status(500).send(`Database error: ${err.message}`);
        res.send('Email verified successfully. You can now log in.');
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token');
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  await applyRateLimit(req, res);
  const { email, password } = req.body;
  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(401).json({ error: 'Invalid email' });
    
    const user = rows[0];
    if (!user.isVerified) return res.status(401).json({ error: 'Please verify your email first.' });

  
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, roles: user.roles },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ token });
  });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// -------------------- GENERIC CRUD --------------------
function makeCrudRoutes(table, pk, allowedFields) {
  // List all
  app.get(`/api/${table}`, (req, res) => {
    db.query(`SELECT * FROM ${table}`, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // Get one
  app.get(`/api/${table}/:id`, (req, res) => {
    db.query(`SELECT * FROM ${table} WHERE ${pk} = ?`, [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    });
  });

  // Create
  app.post(`/api/${table}`, authenticateToken, (req, res) => {
    const body = {};
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) body[f] = req.body[f];
    }
    if (!Object.keys(body).length) {
      return res.status(400).json({ error: 'No valid fields' });
    }
    db.query(`INSERT INTO ${table} SET ?`, body, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, ...body });
    });
  });

  // Update
  app.put(`/api/${table}/:id`, authenticateToken, (req, res) => {
    const body = {};
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) body[f] = req.body[f];
    }
    if (!Object.keys(body).length) {
      return res.status(400).json({ error: 'No valid fields' });
    }
    db.query(`UPDATE ${table} SET ? WHERE ${pk} = ?`, [body, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, ...body });
    });
  });

  // Delete
  app.delete(`/api/${table}/:id`, authenticateToken, (req, res) => {
    db.query(`DELETE FROM ${table} WHERE ${pk} = ?`, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true });
    });
  });
}

// -------------------- REGISTER YOUR TABLES --------------------
makeCrudRoutes('specimen', 'specimen_id', ['museum_id','specimen_name','specimen_number','broad_region','country','locality','region','sex','user_id']);
makeCrudRoutes('museum', 'museum_id', ['museum_name','broad_region','country','locality','region']);
makeCrudRoutes('taxonomy', 'taxonomy_id', ['parvorder','superfamily','family','subfamily','genus','species','specimen_id']);
makeCrudRoutes('taphonomy', 'taphonomy_id', ['specimen_id','bone_id','date_of_record']);
makeCrudRoutes('bone', 'bone_id', ['skeleton_id','bone_type','bone_name','condition','specimen_id']);
makeCrudRoutes('skeletal_inventory', 'skeleton_id', ['specimen_id','condition','skeleton_type','measurements']);

// -------------------- START SERVER --------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});