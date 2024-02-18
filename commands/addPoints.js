const path = require('path')
const fs = require('fs')

const {
    SlashCommandBuilder
} = require('discord.js');
const users = path.join(__dirname, "../data/users.json")
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tokens.json")))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpoints')
        .setDescription('Add a point for an existing employee')
        .addStringOption((option) =>
            option
            .setName("user")
            .setDescription("Name of the Employee")
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName("reason")
            .setDescription("The reason for adding your point!")
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
        const reasonInput = interaction.options.getString("reason")
        const accessToken = interaction.options.getString("token")
        const usersDB = JSON.parse(fs.readFileSync(users));


        function generateId() {
            const timestamp = Date.now().toString(36); // Convert current timestamp to base 36
            const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
            return timestamp + randomString; // Concatenate timestamp and random string
        }

        // Check if the user already exists in the database
        if (accessToken === tokens[interaction.user.id]) {
            const userExists = usersDB.some(user => user.name === inputtedUser);
            if (userExists) {

                const pointObject = {
                    id: generateId(),
                    reason: reasonInput
                }

                usersDB.find(obj => obj.name === inputtedUser).points.push(pointObject)
                fs.writeFileSync(users, JSON.stringify(usersDB))
                await interaction.reply({
                    content: `Successfully added a point!`,
                    ephemeral: true
                })
            } else {
                await interaction.reply({
                    content: `**User "${inputtedUser}" does not exist!**`,
                    ephemeral: true
                })
            }
        } else {
            await interaction.reply({
                content: `**Invalid Token Provided**`,
                ephemeral: true
            })
        }
    }

};