const path = require('path');
const fs = require('fs');
const { SlashCommandBuilder } = require("discord.js");

const users = path.join(__dirname, "../data/users.json");
const usersDB = JSON.parse(fs.readFileSync(users));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("displaypoints")
    .setDescription("Displays your specific points!"),
  async execute(interaction) {
    const interactionUser = interaction.user.username;
    const userExists = usersDB.some(user => user.name === interactionUser);

    if (userExists) {
      const employee = usersDB.find(obj => obj.name === interactionUser);
      var finalString = `Here are your points <@!${interaction.user.id}>! \n\n`;

      await new Promise((resolve, reject) => {
        for (let i = 0; i < employee.points.length; i++) {
          var displayString = `**${i+1}**: ${employee.points[i].reason} | *${employee.points[i].id}*\n`;
          finalString += displayString;
        }
        resolve();
      });

      finalString += `\nYour total points is: **${employee.points.length}**`
      await interaction.reply({
        content: finalString
      });
    }
  },
};

