const path = require('path')
const fs = require('fs')

const {
    SlashCommandBuilder
} = require('discord.js');
const users = path.join(__dirname, "../data/users.json")
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tokens.json")))


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addemployee')
        .setDescription('Add an employee into the JBAK Database.')
        .addStringOption((option) =>
            option
            .setName("user")
            .setDescription("Name of the Employee")
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName("token")
            .setDescription("Access Token for adding Employees")
            .setRequired(true)
        ),
    async execute(interaction) {
        const inputtedUser = interaction.options.getString("user");
        const accessToken = interaction.options.getString("token")
        const usersDB = JSON.parse(fs.readFileSync(users));


 
        // Check if the user already exists in the database
        if (accessToken === tokens[interaction.user.id]) {
            const userExists = usersDB.some(user => user.name === inputtedUser);
            if (userExists) {
                await interaction.reply({
                    content: `**User "${inputtedUser}" already exists in the database!**`,
                    ephemeral: true
                });
                return; // Exit the function if the user already exists
            }

            const userObject = {
                name: inputtedUser,
                points: []
            };
            usersDB.push(userObject)
            fs.writeFileSync(users, JSON.stringify(usersDB));

            await interaction.reply({
                content: `**User ${inputtedUser} has been added to the database!**`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `**Invalid Token Provided**`,
                ephemeral: true
            })
        }
    }

};