const path = require('path')
const fs = require('fs')

const {
    SlashCommandBuilder
} = require('discord.js');
const users = path.join(__dirname, "../data/users.json")
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tokens.json")))


module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteemployee')
        .setDescription('Delete an employee from the JBAK Database.')
        .addStringOption((option) =>
            option
            .setName("user")
            .setDescription("Name of the Employee")
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName("token")
            .setDescription("Access Token for deleting Employees")
            .setRequired(true)
        ),
    async execute(interaction) {
        const inputtedUser = interaction.options.getString("user");
        const accessToken = interaction.options.getString("token");
        const usersDB = JSON.parse(fs.readFileSync(users));

        // Check if the provided token matches the token associated with the user who invoked the command
        if (accessToken === tokens[interaction.user.id]) {
            // Check if the user already exists in the database
            const userIndex = usersDB.findIndex(user => user.name === inputtedUser);
            if (userIndex !== -1) {
                // Delete the user from the database
                usersDB.splice(userIndex, 1);
                fs.writeFileSync(users, JSON.stringify(usersDB));
                await interaction.reply({
                    content: `User "${inputtedUser}" has been deleted from the database.`,
                    ephemeral: true
                });
            } else {
                // User doesn't exist in the database
                await interaction.reply({
                    content: `User "${inputtedUser}" does not exist in the database.`,
                    ephemeral: true
                });
            }
        } else {
            // Invalid token provided
            await interaction.reply({
                content: `Invalid token provided.`,
                ephemeral: true
            });
        }
    }


};