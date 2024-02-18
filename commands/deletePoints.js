const path = require('path')
const fs = require('fs')

const {
    SlashCommandBuilder
} = require('discord.js');
const users = path.join(__dirname, "../data/users.json")
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tokens.json")))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletepoints')
        .setDescription('Add a point for an existing employee')
        .addStringOption((option) =>
            option
            .setName("user")
            .setDescription("Name of the Employee")
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName("id")
            .setDescription("ID of the point/reason.")
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
        const idInput = interaction.options.getString("id")
        const accessToken = interaction.options.getString("token")
        const usersDB = JSON.parse(fs.readFileSync(users));




        // Check if the user already exists in the database
        if (accessToken === tokens[interaction.user.id]) {
            const userExists = usersDB.some(user => user.name === inputtedUser);
            if (userExists) {
                
                const user = usersDB.find(obj => obj.name === inputtedUser)
                
                for(let i = 0; i<user.points.length; i++){
                    var pointData = user.points[i]
                    if(pointData.id === idInput){
                        user.points.pop(pointData)
                        break
                    }
                }
                
                fs.writeFileSync(users, JSON.stringify(usersDB))

                await interaction.reply({
                    content: `Successfully deleted a point!`,
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