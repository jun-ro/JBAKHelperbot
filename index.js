// Get Essential Node Modules

var path = require('path')
var fs = require('fs')

// Setup Bot Token.

require('dotenv').config()

// Setup Discord Client

const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Setup main API for starting the discord bot.

const MainAPI = require('./classes/MainAPI')
const DiscordFramework = new MainAPI(client)

// Setup Commands

const commandFiles = DiscordFramework.getCommandFiles(__dirname);
DiscordFramework.loadCommands(path.join(__dirname, "commands"), commandFiles);
DiscordFramework.deployCommands(path.join(__dirname), process.env.CLIENT_ID);
DiscordFramework.executeCommands();


// Create an activity for the bot

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client.user.setActivity({
    name: "Helper of an amazing team!", // The main text of the rich presence
    type: ActivityType.Playing, // 'PLAYING', 'STREAMING', 'LISTENING', or 'WATCHING'
    details: "Created by IndoJunnie", // Additional details about the bot
  });
});

// Start the bot

client.login(process.env.TOKEN);

