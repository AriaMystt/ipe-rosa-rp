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
  DISCORD_REDIRECT_URI, // e.g. http://localhost:8080/auth/discord/callback
  JWT_SECRET,
  NODE_ENV,
} = process.env;

app.use(express.json());
app.use(cookieParser());

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

    const insert = db.prepare(
      'INSERT OR REPLACE INTO fichas (userId, charName, age, ethnicity, year, connections, lore, type, personality) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    const result = insert.run(userId, charName, age, ethnicity, year, connections, lore, type, personality);

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

// --- Static frontend ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});