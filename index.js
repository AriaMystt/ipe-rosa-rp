import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import db from './database.js';

const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN,
  DISCORD_REDIRECT_URI, // e.g. http://localhost:8080/auth/discord/callback
  DISCORD_WEBHOOK_FICHAS_URL,
  JWT_SECRET,
  NODE_ENV,
} = process.env;

const ADMIN_WHITELIST = (process.env.ADMIN_DISCORD_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cookieParser());

function requireAuth(req, res, next) {
  const token = req.cookies.session;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid session' });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!ADMIN_WHITELIST.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    next();
  });
}

function getAdminStatus(req) {
  const token = req.cookies.session;
  if (!token) return { authenticated: false, isAdmin: false };

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return {
      authenticated: true,
      isAdmin: ADMIN_WHITELIST.includes(user.id),
    };
  } catch {
    return { authenticated: false, isAdmin: false };
  }
}

// --- Auth routes ---

app.get('/auth/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});

app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?login=error');

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) throw new Error(`token exchange failed: ${await tokenRes.text()}`);
    const tokenData = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userRes.ok) throw new Error('failed to fetch user');
    const discordUser = await userRes.json();

    const sessionToken = jwt.sign(
      {
        id: discordUser.id,
        username: discordUser.username,
        avatar: discordUser.avatar,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect('/entrar');
  } catch (err) {
    console.error('Discord OAuth error:', err);
    res.redirect('/?login=error');
  }
});

app.get('/api/me', (req, res) => {
  const token = req.cookies.session;
  if (!token) return res.status(401).json({ user: null });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`;
    res.json({ user: { ...user, avatarUrl } });
  } catch {
    res.status(401).json({ user: null });
  }
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ ok: true });
});

app.post('/api/submit', async (req, res) => {
  const token = req.cookies.session;
  if (!token) return res.status(401).json({ user: null });

  try {
    const user = jwt.verify(token, JWT_SECRET)
    const userId = user.id

    const { charName, age, ethnicity, year, connections, lore, type, personality } = req.body;

    const stmt = db.prepare('SELECT * FROM fichas WHERE userId = ?');
    const oldFicha = stmt.get(userId)

    const insert = db.prepare(
      'INSERT OR REPLACE INTO fichas (userId, charName, age, ethnicity, year, connections, lore, type, personality) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    const result = insert.run(userId, charName, age, ethnicity, year, connections, lore, type, personality);

    const response = await fetch(DISCORD_WEBHOOK_FICHAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `${oldFicha ? `<@&1533241351829979177> [Ficha](https://ipe-rosa.discloud.app/admin/fichas/${userId}) Atualizada de <@${userId}>` : `<@&1533241351829979177> Nova [Ficha](https://ipe-rosa.discloud.app/admin/fichas/${userId}) de <@${userId}>`}`
      })
    });

    res.json({ 
      success: true,
      fichaId: result.lastInsertRowid,
      character: charName,
      message: 'Ficha salva com sucesso!'
    });
  } catch (error) {
    console.error("Erro ao salvar ficha:", error);
    res.status(500).json({ error: 'Erro interno no banco de dados.' });
  }
});

app.get('/api/discord-user/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Fixed path and added missing $ sign for template literal interpolation
    const response = await fetch(`https://discord.com/api/users/${id}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`
      }
    });

    if (!response.ok) {
      console.error(`Discord API error status: ${response.status}`);
      return res.status(response.status).json({ error: 'User not found or bot lacks access' });
    }

    const data = await response.json();
    res.json({ username: data.username, globalName: data.global_name });
  } catch (error) {
    console.error("Failed to query Discord API:", error);
    res.status(500).json({ error: 'Internal API error' });
  }
});


app.get('/api/ficha/:userId', (req, res) => {
  const { userId } = req.params
  const stmt = db.prepare('SELECT * FROM fichas WHERE userId = ?');
  const ficha = stmt.get(userId)
  if (!ficha) {
    return res.status(404).json({ erro: 'Ficha não encontrada' });
  }

  res.json(ficha)
});

app.get('/api/fichas', requireAdmin, async (req, res) =>{
  const stmt = db.prepare('SELECT * FROM fichas')
  const fichas = stmt.all()
  res.json(fichas)
});

app.get('/admin/{*splat}', (req, res, next) => {
  const { authenticated, isAdmin } = getAdminStatus(req);

  if (!authenticated) {
    return res.redirect('/entrar');
  }

  if (!isAdmin) {
    return res.redirect('/entrar');
  }

  // authorized — fall through to serve the SPA normally
  next();
});

// --- Static frontend ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});