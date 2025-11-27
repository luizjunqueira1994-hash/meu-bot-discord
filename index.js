const { Client, GatewayIntentBits, Partials, Events } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// IDs fornecidos por você:
const AUTO_ROLE_ID = "1443627105756643481";         // Cargo automático
const MUSIC_CHANNEL_ID = "1443617421058375801";      // Canal de música
const NEWS_CHANNEL_ID = "1443623964097249372";       // Canal de notícias
const WELCOME_CHANNEL_ID = "1443661105804345404";    // Canal de boas-vindas
const AFK_CHANNEL_ID = "1439019419220054046";        // Canal AFK

// Tempo AFK em milissegundos (5 minutos)
const AFK_TIME = 5 * 60 * 1000;

// -------------------- BOT ONLINE --------------------
client.once(Events.ClientReady, () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// -------------------- CARGO AUTOMÁTICO --------------------
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

// -------------------- MENSAGENS NO CANAL DE MÚSICA --------------------
const MUSIC_CHANNEL_ID = "1443617421058375801";

client.on(Events.MessageCreate, async (message) => {
  if (message.channel.id !== MUSIC_CHANNEL_ID) return;
  if (message.author.bot) return;

  // Prefixos permitidos
  const allowedPrefixes = [
    ";",   // Jockie
    "/",   // Slash
    "m!",  // Seus comandos extras
  ];

  // Verifica se a mensagem começa com algum prefixo permitido
  const isAllowed = allowedPrefixes.some(prefix =>
    message.content.startsWith(prefix)
  );

  // Se for permitido, não apaga
  if (isAllowed) return;

  // Se chegou aqui → mensagem proibida
  try {
    // Envia aviso ANTES de apagar a mensagem (para evitar erro)
    const warning = await message.channel.send(
      "⚠️ **Este canal é exclusivo para comandos de música!**\nUse `;play`, `;skip`, `m!play`, `/play`, etc."
    );

    // Apaga a mensagem do usuário
    await message.delete();

    // Apaga o aviso depois de 5s
    setTimeout(() => {
      warning.delete().catch(() => {});
    }, 5000);

  } catch (err) {
    console.log("Erro ao apagar mensagem ou enviar aviso:", err);
  }
});


// -------------------- IMPORTAÇÕES E CLIENT --------------------

const { Client, GatewayIntentBits, Partials, Events } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

// -------------------- CONFIGURAÇÕES --------------------

// Canal de música
const MUSIC_CHANNEL_ID = "1443617421058375801";

// Prefixo dos comandos do Jockie
const JOCKIE_PREFIX = "m!";

// ID do bot Jockie Music
const JOCKIE_ID = "411916947773587456";

// Canal AFK
const AFK_CHANNEL_ID = "1443627105756643481";

// Timeout para mover usuários ao AFK
const AFK_TIMEOUT = 5 * 60 * 1000; // 5 minutos


// -------------------- FILTRO DE COMANDOS DO JOCKIE --------------------

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const isJockieCommand = message.content.startsWith(JOCKIE_PREFIX);

    // Mensagens em outros canais que não sejam o de música
    if (isJockieCommand && message.channel.id !== MUSIC_CHANNEL_ID) {

        message.channel.send(
            `🎵 **Use os comandos de música no canal correto:** <#${MUSIC_CHANNEL_ID}>`
        );

        // NÃO APAGA mais mensagens automaticamente
    }
});



// -------------------- SISTEMA AFK AUTOMÁTICO --------------------

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const member = newState.member;

    // Ignora bots completamente
    if (member.user.bot) return;

    // Só ativa quando o usuário ENTRA em um canal
    if (!oldState.channelId && newState.channelId) {

        setTimeout(async () => {

            // Recarrega o estado do usuário após 5 minutos
            const freshMember = await newState.guild.members
                .fetch(member.id)
                .catch(() => null);

            if (!freshMember) return;

            const channel = freshMember.voice.channel;
            if (!channel) return; // saiu do canal

            // NÃO mover se o Jockie Music estiver no canal
            if (channel.members.has(JOCKIE_ID)) return;

            // Não mover se o usuário estiver mutado/deaf
            if (freshMember.voice.selfMute || freshMember.voice.selfDeaf) return;

            // Mover para canal AFK
            freshMember.voice.setChannel(AFK_CHANNEL_ID).catch(() => {});

        }, AFK_TIMEOUT);
    }
});

// -------------------- NOTÍCIAS AUTOMÁTICAS --------------------
function enviarNoticia(texto) {
  const canal = client.channels.cache.get(NEWS_CHANNEL_ID);
  if (canal) canal.send(`📰 **Notícia:**\n${texto}`);
}

// Exemplo (você pode alterar depois):
setInterval(() => {
  enviarNoticia("Esta é uma notícia automática de exemplo!");
}, 60 * 60 * 1000); // Envia a cada 1 hora

// -------------------- LOGIN --------------------
client.login("MTQ0MzY1MjIzOTU0NDY4MDYzOQ.GsgxGk.xnmAdO6cm4H4WojTjnF9exV6bnEwQYxWw0ro9k");
