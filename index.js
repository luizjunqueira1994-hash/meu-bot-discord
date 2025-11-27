// index.js - Bot completo (AFK, auto-role, boas-vindas, canal de música filtrado, notícias)

// -------------------- IMPORTS & CLIENT --------------------
const { Client, GatewayIntentBits, Partials, Events } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

// -------------------- CONFIGURAÇÕES (IDs) --------------------
const AUTO_ROLE_ID = "1443627105756643481";
const MUSIC_CHANNEL_ID = "1443617421058375801";
const NEWS_CHANNEL_ID = "1443623964097249372";
const WELCOME_CHANNEL_ID = "1443661105804345404";
const AFK_CHANNEL_ID = "1439019419220054046";

// Jockie
const JOCKIE_ID = "411916947773587456";
const JOCKIE_PREFIX = "m!";

// Timeouts
const AFK_TIMEOUT = 5 * 60 * 1000;

// -------------------- BOT ONLINE --------------------
client.once(Events.ClientReady, () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// -------------------- BOAS-VINDAS + AUTO ROLE --------------------
client.on(Events.GuildMemberAdd, (member) => {
  const role = member.guild.roles.cache.get(AUTO_ROLE_ID);
  if (role) {
    member.roles.add(role).catch(console.error);
  }

  const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (welcomeChannel) {
    welcomeChannel.send(`🎉 Bem-vindo(a) **${member.user.username}** ao servidor!`).catch(console.error);
  }
});

// -------------------- CANAL DE MÚSICA --------------------
client.on(Events.MessageCreate, async (message) => {
  if (message.channel.id !== MUSIC_CHANNEL_ID) return;
  if (message.author.bot) return;

  const allowedPrefixes = [";", "/", "m!"];

  const isAllowed = allowedPrefixes.some(prefix =>
    message.content.toLowerCase().startsWith(prefix)
  );

  if (isAllowed) return;

  try {
    const warning = await message.channel.send(
      "⚠️ **Este canal é exclusivo para comandos de música!**\nUse `;play`, `;skip`, `m!play`, `/play`, etc."
    );

    await message.delete().catch(() => {});

    setTimeout(() => {
      warning.delete().catch(() => {});
    }, 5000);

  } catch (err) {
    console.log("Erro ao lidar com mensagem:", err);
  }
});

// -------------------- SISTEMA AFK --------------------
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  if (!oldState.channelId && newState.channelId) {
    const member = newState.member;

    if (member.user.bot) return;

    setTimeout(async () => {
      const freshMember = await newState.guild.members.fetch(member.id).catch(() => null);
      if (!freshMember) return;

      const channel = freshMember.voice.channel;
      if (!channel) return;

      if (channel.members.has(JOCKIE_ID)) return;

      if (freshMember.voice.selfMute || freshMember.voice.selfDeaf) return;

      freshMember.voice.setChannel(AFK_CHANNEL_ID).catch((err) => {
        console.log("Falha ao mover para AFK:", err?.message ?? err);
      });
    }, AFK_TIMEOUT);
  }
});

// -------------------- CANAL DE NOTÍCIAS --------------------
client.on(Events.MessageCreate, (message) => {
  if (message.channel.id === NEWS_CHANNEL_ID && !message.author.bot) {
    message.delete().catch(() => {});
  }
});

function enviarNoticia(texto) {
  const canal = client.channels.cache.get(NEWS_CHANNEL_ID);
  if (canal) canal.send(`📰 **Notícia:**\n${texto}`).catch(() => {});
}

setInterval(() => {
  enviarNoticia("Esta é uma notícia automática de exemplo!");
}, 60 * 60 * 1000);

// -------------------- LOGIN --------------------
client.login(process.env.TOKEN);
