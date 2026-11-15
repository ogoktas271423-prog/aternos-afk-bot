const express = require('express');
const mineflayer = require('mineflayer');

// Render'ın servisi kapatmaması için sahte web sunucusu
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('AFK Bot Aktif!'));
app.listen(PORT, () => console.log(`Web sunucusu ${PORT} portunda çalışıyor.`));

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.MC_HOST,
    port: parseInt(process.env.MC_PORT) || 25565,
    username: process.env.MC_USER || 'AFK_Bot_TR',
    version: process.env.MC_VERSION || false
  });

  bot.on('spawn', () => {
    console.log('Bot sunucuya giriş yaptı!');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
  });

  bot.on('kicked', (reason) => console.log('Sunucudan atıldı:', reason));
  bot.on('error', (err) => console.log('Bağlantı hatası:', err.message));
  bot.on('end', () => {
    console.log('Bağlantı koptu, 15 saniye sonra tekrar deneniyor...');
    setTimeout(createBot, 15000);
  });
}

createBot();
