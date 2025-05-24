const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task_manager_js'
});

db.connect(err => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// GET all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// ADD a new task
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    db.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, title, description });
    });
});

// UPDATE a task
app.put('/tasks/:id', (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ id, title, description });
    });
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

const PORT =3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
