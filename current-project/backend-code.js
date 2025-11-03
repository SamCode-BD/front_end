/*
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';
  */

require('dotenv').config({path: ".env.production"});


//const {Resend} = require('resend');
//const resend = new Resend(process.env.RESEND_API_KEY);

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {RateLimiterMemory} = require('rate-limiter-flexible');
const { saveTaphonomyData, loadTaphonomyData, deleteTaphonomyData } = require('./taphonomyHelpers');


const rateLimiter = new RateLimiterMemory({
  points: 60,       // 60 requests
  duration: 60,    // per 60 seconds
});

const app = express();
const port = 7286;

// Use environment variable for SECRET_KEY
const SECRET_KEY = process.env.JWT_SECRET || 'SecretKey';

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST, // Use environment variables for sensitive information
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
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

db.on('error', (err) => {
  console.error('MySQL error', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection lost — exiting...');
    process.exit(1); // PM2 will auto-restart it
  }
});



// -------------------- AUTH ROUTES --------------------

// Register new user
app.post('/api/register', async (req, res) => {
  try {

    await captchaHandler(req, res);
    await applyRateLimit(req, res);

    const { name, email, password, roles } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      //'INSERT INTO user (name, email, password, roles, isVerified VALUES (?, ?, ?, ?, FALSE)',
      'INSERT INTO user (name, email, password, roles, isVerified) VALUES (?, ?, ?, ?, TRUE)',
      [name, email, hashed, roles || 'user'],
      async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const newUser = { id: result.insertId, email };

        return res.status(201).json({
            message: 'Account created.',
            id: result.insertId,
            name,
            email,
            roles,
          });

          
        /*
        try {
          await sendVerificationEmail(newUser);

          
        } catch (emailErr) {
          console.error('Email send error:', emailErr);
          return res.status(500).json({ error: 'Account created, but failed to send verification email.' });
        }
          */
      }
    );
  } catch (err) {
      return;
  }
});

/*
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
*/

// Login user
app.post('/api/login', async (req, res) => {
  await applyRateLimit(req, res);
  const { email, password } = req.body;
  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(401).json({ error: 'Invalid email' });
    
    const user = rows[0];
    //if (!user.isVerified) return res.status(401).json({ error: 'Please verify your email first.' });

  
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.user_id, name: user.name, email: user.email, roles: user.roles },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ token });
  });
});


// Save bone measurements (complex insert)
app.post('/api/bones/complete', async (req, res) => {
  try {
    const { specimenNumber, museumId, boneName, boneType, sex, user, localityData, measurements } = req.body;
    
    console.log('Received data:', { specimenNumber, museumId, boneName, boneType, sex, user, localityData, measurements });
    
    // Determine which table to use based on bone type
    const axialBones = ['sacrum', 'cervical_vertebrae', 'thoracic_vertebrae', 'lumbar_vertebrae'];
    const isAxialBone = axialBones.includes(boneType);
    const measurementsTable = isAxialBone ? 'axial_measurements' : 'appendicular_measurements';
    
    console.log('Using table:', measurementsTable);
    
    // Step 1: Get museum abbreviation for specimen_name
    const [museumResult] = await db.promise().query(
      'SELECT museum_name FROM museum WHERE museum_id = ?',
      [parseInt(museumId)]
    );
    
    if (museumResult.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid museum ID'
      });
    }
    
    const museumAbbreviation = museumResult[0].museum_name;
    const specimenName = `${museumAbbreviation}-${specimenNumber}`;
    
    console.log('Creating specimen:', specimenName);
    
    // Step 2: Check if specimen exists
    const checkSpecimenQuery = `SELECT specimen_id FROM specimen WHERE specimen_name = ?`;
    const [existingSpecimen] = await db.promise().query(checkSpecimenQuery, [specimenName]);
    
    let specimenId;
    
    if (existingSpecimen.length === 0) {
      // Create new specimen with taxonomy data
      const specimenQuery = `
        INSERT INTO specimen (specimen_name, specimen_number, museum_id, sex, user_id, broad_region, country, locality, region) 
        VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?)
      `;
      const [specimenResult] = await db.promise().query(specimenQuery, [
        specimenName,
        parseInt(specimenNumber),
        parseInt(museumId),
        sex,
        localityData?.broadRegion || null,
        localityData?.country || null,
        localityData?.locality || null,
        localityData?.region || null
      ]);
      specimenId = specimenResult.insertId;
      console.log('Created new specimen with ID:', specimenId);
    } else {
      specimenId = existingSpecimen[0].specimen_id;
      console.log('Specimen already exists with ID:', specimenId);
    }
    
    // Step 3: Insert into bone table
    const boneQuery = `
      INSERT INTO bone (bone_name, bone_type, specimen_id) 
      VALUES (?, ?, ?)
    `;
    const [boneResult] = await db.promise().query(boneQuery, [boneName, boneType, specimenId]);
    const boneId = boneResult.insertId;
    console.log('Inserted bone with auto-generated ID:', boneId);
    
    // Step 4: Process measurements and handle vertebrae ranges
    const columnsToInsert = {
      bone_id: boneId,
      bone_name: boneName
    };
    
    // Process each measurement
    Object.keys(measurements).forEach(key => {
      const value = measurements[key];
      if (value === '' || value === null || value === undefined) {
        return;
      }
      
      // Check if it's a vertebrae bone type
      if (boneType === 'cervical_vertebrae' || boneType === 'thoracic_vertebrae' || boneType === 'lumbar_vertebrae') {
        const vertebraMatch = key.match(/^([CTL])(\d+)$/i);
        if (vertebraMatch) {
          const type = vertebraMatch[1].toLowerCase();
          const number = vertebraMatch[2];
          const columnName = `vertebra_${type}${number}_max_height`;
          columnsToInsert[columnName] = parseFloat(value);
          return;
        }
        
        const rangeMatch = key.match(/^Max ([CTL])(\d+)-([CTL])(\d+) Height$/i);
        if (rangeMatch) {
          const type = rangeMatch[1].toLowerCase();
          const startNum = parseInt(rangeMatch[2]);
          const endNum = parseInt(rangeMatch[4]);
          
          for (let i = startNum; i <= endNum; i++) {
            const columnName = `vertebra_${type}${i}_max_height`;
            columnsToInsert[columnName] = parseFloat(value);
          }
          return;
        }
      }
      
      if (boneType === 'sacrum') {
        let cleanName = key
          .replace(/\([^)]*\)/g, '')
          .replace(/\//g, ' ')
          .replace(/-/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_');
        
        const columnName = `sacrum_${cleanName}`;
        columnsToInsert[columnName] = parseFloat(value);
        return;
      }
      
      if (!isAxialBone) {
        let cleanName = key
          .replace(/\([^)]*\)/g, '')
          .replace(/\//g, ' ')
          .replace(/-/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_');
        
        const columnName = `${boneType}_${cleanName}`;
        columnsToInsert[columnName] = parseFloat(value);
      }
    });
    
    // Step 5: Build and execute the INSERT query
    const columns = Object.keys(columnsToInsert).map(col => `\`${col}\``);
    const values = Object.values(columnsToInsert);
    const placeholders = values.map(() => '?');
    
    const measurementsQuery = `
      INSERT INTO ${measurementsTable} (${columns.join(', ')}) 
      VALUES (${placeholders.join(', ')})
    `;
    
    console.log('Measurements SQL Query:', measurementsQuery);
    console.log('Values:', values);
    
    await db.promise().query(measurementsQuery, values);
    
    res.status(201).json({ 
      success: true, 
      message: 'All data saved successfully',
      boneId: boneId,
      specimenId: specimenId,
      specimenName: specimenName,
      measurementsTable: measurementsTable
    });
    
  } catch (error) {
    console.error('Error saving bone data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save bone data',
      error: error.message 
    });
  }
});

// Load all postcranial metrics for a skeleton
app.get('/api/postcranial_metrics/:skeleton_id', (req, res) => {
  const { skeleton_id } = req.params;
  console.log(skeleton_id);
  db.query(
    'SELECT * FROM postcranial_metrics WHERE skeleton_id = ?',
    [skeleton_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      //console.log(rows);
      if (!rows.length) return res.json([]);

      const row = rows[0];
      const formatted = Object.entries(row)
        .filter(([key]) => key !== "skeleton_id")
        .map(([key, value]) => ({
          metric_name: key,
          metric_value: value,
        }));

      res.json(formatted);
    }
  );
});

app.post('/api/postcranial_metrics/:skeleton_id', async (req, res) => {
  try {
    const { skeleton_id } = req.params;
    const { metrics } = req.body; // array of { metric_name, metric_value }

    if (!Array.isArray(metrics)) {
      return res.status(400).json({ error: "metrics array required" });
    }

    // Build dynamic columns and values
    const columns = ["skeleton_id"];
    const values = [skeleton_id];
    const placeholders = ["?"];

    metrics.forEach(({ metric_name, metric_value }) => {
      if (metric_value !== null && metric_value !== undefined && metric_value !== "") {
        //const col = toColumnName(metric_name);
        const col = metric_name;
        columns.push(`\`${col}\``);
        values.push(metric_value);
        placeholders.push("?");
      }
    });

    // ✅ Handle empty case
    if (columns.length === 1) {
      // No metrics provided — just ensure the row exists
      const insertSkeletonRow = `
        INSERT IGNORE INTO postcranial_metrics (skeleton_id)
        VALUES (?)
      `;
      await db.promise().query(insertSkeletonRow, [skeleton_id]);
      return res.json({ ok: true, message: "No metrics to update" });
    }

    // ✅ Safe upsert if metrics exist
    const sql = `
      INSERT INTO postcranial_metrics (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      ON DUPLICATE KEY UPDATE ${columns
        .filter((c) => c !== "skeleton_id")
        .map((c) => `${c} = VALUES(${c})`)
        .join(", ")}
    `;

    await db.promise().query(sql, values);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error saving postcranial metrics:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/taxonomy/bySpecimen/:specimen_id', (req, res) => {
  db.query(`SELECT * FROM taxonomy WHERE specimen_id = ?`, [req.params.specimen_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
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

async function captchaHandler(req, res) {
    //Captcha ----------------------------------------------
        const secretKey = process.env.REACT_CAPTCHA_SECRET_KEY;
    
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captchaToken}`;
        const captchaResponse = await fetch(verifyUrl, { method: 'POST' });
        const captchaData = await captchaResponse.json();
    
        if (!captchaData.success) {

          res.status(400).json({ message: 'CAPTCHA verification failed' });
          console.log(captchaData);
          throw new Error("Captcha failed");
          
        }
        //-----------------------------------------------------
}



async function applyRateLimit(req, res) {
  const ip = String((req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''));

  try {
    await rateLimiter.consume(ip);
  } catch (rateLimiterRes) {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
    throw new Error('Rate limit exceeded');
  }
}

/*
async function sendVerificationEmail(user) {
  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.EMAIL_JWT_SECRET,
    { expiresIn: '1d' }
  );

  const verifyUrl = `http://localhost:3001/api/verify-email?token=${token}`;

  const {data, error} = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Verify your email',
    html: `
      <p>Hello!</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
    
  });

  if (error) {
    res.status(500).json({ error: 'Account created, but failed to send verification email.' });
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
  */

// -------------------- INVENTORY SAVE/LOAD --------------------

// Load cranial inventory for a specimen
app.get('/api/cranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  db.query(
    `SELECT inv_entry_name, value, taphonomy_id FROM cranial_inventory WHERE specimen_id = ?`,
    [specimen_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Save cranial inventory (insert/delete sync)
app.post('/api/cranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  const { inventory } = req.body; // array of {inv_entry_name, value?, taphonomy_id?} filtered by isChecked == true

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Delete rows no longer checked
    const names = inventory.map(i => i.inv_entry_name);
    const deleteQuery = names.length
      ? `DELETE FROM cranial_inventory WHERE specimen_id = ? AND inv_entry_name NOT IN (?)`
      : `DELETE FROM cranial_inventory WHERE specimen_id = ?`;
    const deleteParams = names.length ? [specimen_id, names] : [specimen_id];

    db.query(deleteQuery, deleteParams, err => {
      if (err) {
        db.rollback(() => res.status(500).json({ error: err.message }));
        return;
      }

      // 2. Insert or update checked boxes
      if (!inventory.length) {
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
        return;
      }

      const insertValues = inventory.map(i => [
        specimen_id,
        i.inv_entry_name,
        i.value ?? null,
        i.taphonomy_id ?? null
      ]);

      const insertQuery = `
        INSERT INTO cranial_inventory (specimen_id, inv_entry_name, value, taphonomy_id)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          value = VALUES(value),
          taphonomy_id = VALUES(taphonomy_id)
      `;

      db.query(insertQuery, [insertValues], err => {
        if (err) {
          db.rollback(() => res.status(500).json({ error: err.message }));
          return;
        }
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
      });
    });
  });
});


// ----- Postcranial Inventory -----

app.get('/api/postcranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  db.query(
    `SELECT inv_entry_name, value, taphonomy_id FROM postcranial_inventory WHERE specimen_id = ?`,
    [specimen_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post('/api/postcranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  const { inventory } = req.body;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    const names = inventory.map(i => i.inv_entry_name);
    const deleteQuery = names.length
      ? `DELETE FROM postcranial_inventory WHERE specimen_id = ? AND inv_entry_name NOT IN (?)`
      : `DELETE FROM postcranial_inventory WHERE specimen_id = ?`;
    const deleteParams = names.length ? [specimen_id, names] : [specimen_id];

    db.query(deleteQuery, deleteParams, err => {
      if (err) {
        db.rollback(() => res.status(500).json({ error: err.message }));
        return;
      }

      if (!inventory.length) {
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
        return;
      }

      const insertValues = inventory.map(i => [
        specimen_id,
        i.inv_entry_name,
        i.value ?? null,
        i.taphonomy_id ?? null
      ]);

      const insertQuery = `
        INSERT INTO postcranial_inventory (specimen_id, inv_entry_name, value, taphonomy_id)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          value = VALUES(value),
          taphonomy_id = VALUES(taphonomy_id)
      `;

      db.query(insertQuery, [insertValues], err => {
        if (err) {
          db.rollback(() => res.status(500).json({ error: err.message }));
          return;
        }
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
      });
    });
  });
});


// -------------------- GENERIC CRUD --------------------
function makeCrudRoutes(table, pk, allowedFields) {
  app.get(`/api/${table}`, (req, res) => {
    const {
      q,                 // search term
      limit = 25,        // page size
      offset = 0,        // offset
      sort = pk,         // column to sort by
      dir = 'ASC',       // ASC | DESC
    } = req.query;

    // Validate sort & dir
    const allowedSorts = new Set([pk, ...allowedFields]);
    const SAFE_SORT = allowedSorts.has(String(sort)) ? String(sort) : pk;
    const SAFE_DIR = String(dir).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // WHERE for fuzzy search across pk + fields
    const searchable = [pk, ...allowedFields];
    const where = q
      ? `WHERE CONCAT_WS(' ', ${searchable.map(c => `\`${c}\``).join(', ')}) LIKE ?`
      : '';

    const params = [];
    if (q) params.push(`%${q}%`);
    params.push(Number(limit), Number(offset));

    const sql = `
      SELECT * FROM \`${table}\`
      ${where}
      ORDER BY \`${SAFE_SORT}\` ${SAFE_DIR}
      LIMIT ? OFFSET ?
    `;

    db.query(sql, params, (err, rows) => {
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
  app.post(`/api/${table}`, authenticateToken, async (req, res) => {
  try {
    const body = {};
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) body[f] = req.body[f];
    }
    if (!Object.keys(body).length)
      return res.status(400).json({ error: "No valid fields" });

    const [result] = await db.promise().query(`INSERT INTO ${table} SET ?`, body);

    const pkName = pk;
    res.status(201).json({ [pkName]: result.insertId, ...body });
  } catch (err) {
    console.error("Error inserting:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post(`/api/${table}/:id`, authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const body = {};
      for (const f of allowedFields) {
        if (req.body[f] !== undefined) body[f] = req.body[f];
      }
      if (!Object.keys(body).length)
        return res.status(400).json({ error: "No valid fields" });

      // Ensure the PK is in the body so MySQL accepts the insert
      //body[pk] = id;

      // Upsert logic
      const sql = `
        INSERT INTO ${table} (${[pk, ...Object.keys(body)].map(c => `\`${c}\``).join(", ")})
        VALUES (${[pk, ...Object.keys(body)].map(() => "?").join(", ")})
        ON DUPLICATE KEY UPDATE ${Object.keys(body)
          .map(c => `${c} = VALUES(${c})`)
          .join(", ")}
      `;

      const values = [id, ...Object.values(body)];
      await db.promise().query(sql, values);
      res.status(201).json({ ok: true, [pk]: id });
    } catch (err) {
      console.error("Error inserting by ID:", err);
      res.status(500).json({ error: err.message });
    }
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
makeCrudRoutes('skeletal_inventory', 'skeleton_id', ['specimen_id', 'skeleton_type','skeleton_name']);
makeCrudRoutes('cranium_measurements', 'specimen_id', ['specimen_id', 'maximum_cranial_length', 'maximum_cranial_breadth',
               'bizygomatic_diameter', 'basion_bregma_height', 'cranial_base_length', 'basion_prosthion_length',
               'maxillo_alveolar_breadth', 'maxillo_alveolar_length', 'biauricular_breadth', 'upper_facial_height',
               'minimum_frontal_breadth', 'upper_facial_breadth', 'nasal_height', 'nasal_breadth', 'orbital_breadth',
               'orbital_height', 'biorbital_breadth', 'interorbital_breadth', 'frontal_chord', 'parietal_chord',
               'occipital_chord', 'foramen_magnum_length', 'foramen_magnum_breadth', 'mastoid_height']);
makeCrudRoutes('mandible_measurements', 'specimen_id', ['specimen_id', 'chin_height', 'height_of_the_mandibular_body_at_the_mental_foramen',
               'breadth_of_the_mandibular_body_at_the_mental_foramen', 'bigonial_width', 'bicondylar_breadth',
               'minimum_ramus_breadth', 'maximum_ramus_breadth', 'maximum_ramus_height', 'mandibular_length', 'mandibular_angle']);
makeCrudRoutes('has_skeleton', 'specimen_id', ['specimen_id', 'skeleton_id']);

// -------------------- FACIAL, LATERAL, BASILAR, MANDIBULAR, MACROMORPHOSCOPICS --------------------
makeCrudRoutes('facial', 'specimen_id', [
  'left_infraorbital_suture', 'right_infraorbital_suture',
  'left_infraorbital_foramen', 'right_infraorbital_foramen',
  'left_zygomaticofacial_foramen', 'right_zygomaticofacial_foramen',
  'metopic_suture',
  'left_supraorbital_notch', 'right_supraorbital_notch',
  'left_supraorbital_foramen', 'right_supraorbital_foramen',
  'left_supratrochlear_notch', 'right_supratrochlear_notch',
  'left_coronal_ossicle', 'right_coronal_ossicle',
  'left_epipteric_bone', 'right_epipteric_bone'
]);

makeCrudRoutes('lateral', 'specimen_id', [
  'bregmatic_bone', 'saggital_ossicle',
  'left_parietal_foramen', 'midline_parietal_foramen', 'right_parietal_foramen',
  'apical_bone', 'inca_bone',
  'left_lambdoid_ossicle', 'right_lamdoid_ossicle',
  'left_asterionic_bone', 'right_asterionic_bone',
  'left_ossicle_in_occipitomastoid_suture', 'right_ossicle_in_occipitomastoid_suture',
  'left_parietal_notch_bone', 'right_parietal_notch_bone',
  'left_auditory_exostosis', 'right_auditory_exostosis',
  'left_mastoid_foramen_number', 'right_mastoid_foramen_number',
  'left_mastoid_foramen_location', 'right_mastoid_foramen_location'
]);

makeCrudRoutes('basilar', 'specimen_id', [
  'left_condylar_canal', 'right_condylar_canal',
  'left_divided_hypoglossal_canal', 'right_divided_hypoglossal_canal',
  'left_tympanic_dehiscence', 'right_tympanic_dehiscence',
  'left_foramen_spinosum_incomplete', 'right_foramen_spinosum_incomplete',
  'left_foramen_ovale_incomplete', 'right_foramen_ovale_incomplete',
  'left_pterygospinous_bridge', 'right_pterygospinous_bridge',
  'left_pterygoalar_bridge', 'right_pterygoalar_bridge',
  'palatine_torus_development', 'palatine_torus_location'
]);

makeCrudRoutes('mandibular', 'specimen_id', [
  'left_mylohyoid_bridge_development', 'right_mylohyoid_bridge_development',
  'left_mylohyoid_bridge_location', 'right_mylohyoid_bridge_location',
  'left_mental_foramen', 'right_mental_foramen',
  'left_mandibular_torus', 'right_mandibular_torus'
]);

makeCrudRoutes('macromorphoscopics', 'specimen_id', [
  'anterior_nasal_spine', 'inferior_nasal_aperture',
  'interorbital_breadth', 'malar_tubercule',
  'nasal_aperture_shape', 'nasal_aperture_width',
  'nasal_bone_contour', 'nasal_bone_shape',
  'nasal_overgrowth', 'nasofrontal_suture',
  'orbital_shape', 'postbregmatic_depression',
  'posterior_zygomatic_tubercule', 'supranasal_suture',
  'zygomaticomaxillary_suture_course', 'transverse_palatine_suture'
]);


// -------------------- START SERVER --------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});