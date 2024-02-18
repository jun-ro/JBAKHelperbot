const { Collection, REST, Routes, Events } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

class CommandHandlers {
  constructor(client) {
    this.client = client;
  }
  
  // Function to scan and retrieve command files from a specified folder
  getCommandFiles(folder) {
    this.client.commands = new Collection();
    const commandsPath = path.join(folder, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    return commandFiles;
  }
  
  // Function to load commands from command files into the bot's command collection
  loadCommands(commandsPath, commandFiles) {
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        this.client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
  
  // Function to execute commands when interactions occur
  executeCommands() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }
  
  // Function to deploy commands to Discord's API
  deployCommands(folder, clientId) {
    const commands = [];
    const commandsPath = path.join(folder, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`${commandsPath}/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    (async () => {
      try {
        console.log(
          `Started refreshing ${commands.length} application (/) commands.`
        );

        const data = await rest.put(Routes.applicationCommands(clientId), {
          body: commands,
        });

        console.log(
          `Successfully reloaded ${data.length} application (/) commands.`
        );
      } catch (error) {
        console.error(error);
      }
    })();
  }
}

module.exports = CommandHandlers;
