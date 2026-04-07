const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',   // Docker service name
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'textapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint to save text
app.post('/api/texts', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Text content cannot be empty' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (content) VALUES (?)',
      [content]
    );

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Text successfully saved to MySQL!' 
    });
  } catch (error) {
    console.error('Error saving text:', error);
    res.status(500).json({ error: 'Failed to save text to database' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
