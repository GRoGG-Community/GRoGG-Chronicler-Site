const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

const DB_FILE = path.join(__dirname, 'chatlogs.sqlite');
const db = new sqlite3.Database(DB_FILE);

const PUBLIC_DIR = path.join(__dirname, 'public');
const EMPIRE_INFO_FILE = path.join(PUBLIC_DIR, 'empireInfo.json');
const ACCOUNTS_FILE = path.join(PUBLIC_DIR, 'accounts.json');
const EMPIRES_FILE = path.join(PUBLIC_DIR, 'empires.json');
const TREATIES_FILE = path.join(PUBLIC_DIR, 'treaties.json');
const DATA_FILE = path.join(__dirname, 'messages.json');

// --- Helper: Load/Save JSON ---
function loadJson(file, fallback) {
    try {
        const raw = fs.readFileSync(file, 'utf8');
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}
function saveJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// --- SQLite Table Init ---
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        board TEXT,
        author TEXT,
        text TEXT,
        timestamp INTEGER,
        deleted INTEGER DEFAULT 0
    )`);
});

// --- Migration: messages.json to SQLite ---
function migrateMessagesToSQLite() {
    if (!fs.existsSync(DATA_FILE)) return;
    let messagesObj;
    try { messagesObj = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return; }
    db.serialize(() => {
        for (const board in messagesObj) {
            for (const msg of messagesObj[board]) {
                db.run(
                    `INSERT INTO messages (board, author, text, timestamp, deleted)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        board,
                        msg.author,
                        msg.text,
                        msg.timestamp || Date.now(),
                        msg.deleted ? 1 : 0
                    ]
                );
            }
        }
    });
    fs.renameSync(DATA_FILE, DATA_FILE + '.bak');
}
db.get('SELECT COUNT(*) AS cnt FROM messages', (err, row) => {
    if (row && row.cnt === 0) migrateMessagesToSQLite();
});

// --- API: GET messages for a board ---
app.get('/api/messages', (req, res) => {
    const board = req.query.board;
    if (!board) return res.status(400).json([]);
    db.all(
        'SELECT author, text, timestamp, deleted FROM messages WHERE board = ? ORDER BY timestamp ASC',
        [board],
        (err, rows) => {
            if (err) return res.status(500).json([]);
            res.json(rows.map(r => ({
                author: r.author,
                text: r.text,
                timestamp: r.timestamp,
                deleted: !!r.deleted
            })));
        }
    );
});

// --- API: POST a new message ---
app.post('/api/messages', (req, res) => {
    const { board, author, text, timestamp } = req.body;
    if (!board || !author || !text) return res.status(400).json({ error: 'Missing fields' });
    db.run(
        'INSERT INTO messages (board, author, text, timestamp, deleted) VALUES (?, ?, ?, ?, 0)',
        [board, author, text, timestamp || Date.now()],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to save message' });
            res.json({ success: true });
        }
    );
});

// --- API: Delete a message by index (GameMaster only) ---
app.post('/api/messages/delete', (req, res) => {
    const { board, index } = req.body;
    if (typeof board !== 'string' || typeof index !== 'number') {
        return res.status(400).json({ error: 'Missing fields' });
    }
    db.all(
        'SELECT id FROM messages WHERE board = ? ORDER BY timestamp ASC',
        [board],
        (err, rows) => {
            if (err || !rows || index < 0 || index >= rows.length) {
                return res.status(404).json({ error: 'Message not found' });
            }
            const msgId = rows[index].id;
            db.run(
                'UPDATE messages SET text = ?, deleted = 1 WHERE id = ?',
                ['[This message has been deleted by GameMaster]', msgId],
                function (err2) {
                    if (err2) return res.status(500).json({ error: 'Failed to delete message' });
                    res.json({ success: true });
                }
            );
        }
    );
});

// --- Serve JSON files with cache busting ---
function serveJson(file, fallback) {
    return (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) return res.status(404).json(fallback);
            res.send(data);
        });
    };
}
app.get('/empireInfo.json', serveJson(EMPIRE_INFO_FILE, {}));
app.get('/accounts.json', serveJson(ACCOUNTS_FILE, {}));
app.get('/empires.json', serveJson(EMPIRES_FILE, []));
app.get('/treaties.json', serveJson(TREATIES_FILE, []));

// --- Empires API ---
function loadEmpires() { return loadJson(EMPIRES_FILE, []); }
function saveEmpires(empires) { saveJson(EMPIRES_FILE, empires); }

app.post('/api/empires/link', (req, res) => {
    const { empireName, accountName } = req.body;
    if (!empireName || !accountName) return res.status(400).json({ error: 'Missing fields' });
    const empires = loadEmpires();
    const idx = empires.findIndex(e => e.name === empireName);
    if (idx === -1) return res.status(404).json({ error: 'Empire not found' });
    empires[idx].account = accountName;
    try {
        saveEmpires(empires);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to link account' });
    }
});

app.post('/api/empires/unlink', (req, res) => {
    const { empireName } = req.body;
    if (!empireName) return res.status(400).json({ error: 'Missing fields' });
    const empires = loadEmpires();
    const idx = empires.findIndex(e => e.name === empireName);
    if (idx === -1) return res.status(404).json({ error: 'Empire not found' });
    empires[idx].account = null;
    try {
        saveEmpires(empires);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to unlink account' });
    }
});

app.post('/api/empires/create', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing fields' });
    const empires = loadEmpires();
    if (empires.some(e => e.name === name)) return res.json({ error: 'Empire already exists' });
    empires.push({ name, account: null });
    try {
        saveEmpires(empires);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to create empire' });
    }
});

app.post('/api/empires/delete', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing fields' });
    let empires = loadEmpires();
    const idx = empires.findIndex(e => e.name === name);
    if (idx === -1) return res.json({ error: 'Empire does not exist' });
    empires = empires.filter(e => e.name !== name);
    try {
        saveEmpires(empires);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to delete empire' });
    }
});

app.post('/api/empires/rename', (req, res) => {
    const { name, newName } = req.body;
    if (!name || !newName) return res.status(400).json({ error: 'Missing fields' });
    let empires = loadEmpires();
    const idx = empires.findIndex(e => e.name === name);
    if (idx === -1) return res.json({ error: 'Empire does not exist' });
    if (empires.some(e => e.name === newName)) return res.json({ error: 'Empire name already exists' });
    empires[idx].name = newName;
    saveEmpires(empires);

    // Update empireInfo.json
    let empireInfo = loadJson(EMPIRE_INFO_FILE, {});
    if (empireInfo[name]) {
        empireInfo[newName] = empireInfo[name];
        delete empireInfo[name];
        saveJson(EMPIRE_INFO_FILE, empireInfo);
    }
    res.json({ success: true });
});

// --- Empire Info API ---
app.post('/api/empireInfo', (req, res) => {
    const { name, info } = req.body;
    if (!name || !info) return res.status(400).json({ error: 'Missing fields' });
    const empireInfo = loadJson(EMPIRE_INFO_FILE, {});
    empireInfo[name] = info;
    try {
        saveJson(EMPIRE_INFO_FILE, empireInfo);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to save empire info' });
    }
});

// --- Accounts API ---
function loadAccounts() { return loadJson(ACCOUNTS_FILE, {}); }
function saveAccounts(accounts) { saveJson(ACCOUNTS_FILE, accounts); }

app.post('/api/accounts', (req, res) => {
    const { name, pass } = req.body;
    if (!name || !pass) return res.status(400).json({ error: 'Missing fields' });
    const accounts = loadAccounts();
    if (accounts[name]) return res.json({ error: 'Account already exists' });
    accounts[name] = pass;
    try {
        saveAccounts(accounts);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to save account' });
    }
});

app.post('/api/accounts/rename', (req, res) => {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) return res.status(400).json({ error: 'Missing fields' });
    const accounts = loadAccounts();
    if (!accounts[oldName]) return res.json({ error: 'Account does not exist' });
    if (accounts[newName]) return res.json({ error: 'New name already exists' });
    accounts[newName] = accounts[oldName];
    delete accounts[oldName];
    try {
        saveAccounts(accounts);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to rename account' });
    }
});

app.post('/api/accounts/password', (req, res) => {
    const { name, pass } = req.body;
    if (!name || !pass) return res.status(400).json({ error: 'Missing fields' });
    const accounts = loadAccounts();
    if (!accounts[name]) return res.json({ error: 'Account does not exist' });
    accounts[name] = pass;
    try {
        saveAccounts(accounts);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

app.post('/api/accounts/delete', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing fields' });
    const accounts = loadAccounts();
    if (!accounts[name]) return res.json({ error: 'Account does not exist' });
    delete accounts[name];
    try {
        saveAccounts(accounts);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// --- Treaties API ---
function loadTreaties() { return loadJson(TREATIES_FILE, []); }
function saveTreaties(treaties) { saveJson(TREATIES_FILE, treaties); }

app.post('/api/treaties', (req, res) => {
    const treaty = req.body;
    if (!treaty || !treaty.title || !treaty.content || !Array.isArray(treaty.participants) || !treaty.owner) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    let treaties = loadTreaties();
    if (treaty.id) {
        const idx = treaties.findIndex(t => t.id === treaty.id);
        if (idx !== -1) {
            treaties[idx] = { ...treaties[idx], ...treaty };
        } else {
            treaties.push(treaty);
        }
    } else {
        treaty.id = Date.now().toString();
        treaties.push(treaty);
    }
    try {
        saveTreaties(treaties);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to save treaty' });
    }
});

app.post('/api/treaties/transfer', (req, res) => {
    const { id, newOwner } = req.body;
    if (!id || !newOwner) return res.status(400).json({ error: 'Missing fields' });
    let treaties = loadTreaties();
    const idx = treaties.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Treaty not found' });
    treaties[idx].owner = newOwner;
    try {
        saveTreaties(treaties);
        res.json({ success: true });
    } catch {
        res.status(500).json({ error: 'Failed to transfer treaty' });
    }
});

// Add this route for saving treaties.json
app.post('/api/treaties/json', (req, res) => {
    const treaties = req.body;
    if (!Array.isArray(treaties)) {
        return res.status(400).json({ success: false, error: 'Treaties data must be an array.' });
    }
    const filePath = path.join(__dirname, 'public', 'treaties.json');
    fs.writeFile(filePath, JSON.stringify(treaties, null, 2), err => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to write treaties.json' });
        }
        res.json({ success: true });
    });
});

// --- Static files and SPA fallback ---
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(PUBLIC_DIR));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// --- Start server ---
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


