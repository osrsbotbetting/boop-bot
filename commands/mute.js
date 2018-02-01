const Discord = require('discord.js'); 
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //check if executor has permission 
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.")
    //get mentioned user, return if none
    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toMute) return message.channel.send("Specify a user mention or ID.");
    //mute/make mute role
    let role = message.guild.roles.find(r => r.name === "Muted");
    if(!role) {
        try {
            role = await message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            });

            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch(e) {
            console.log(e.stack);
        }    
    }

    if(toMute.roles.has(role.id)) return message.channel.send("This user is already muted");

    bot.mutes[toMute.id] = {
        guild: message.guild.id,
        time: Date.now() + parseInt(args[1]) * 1000
    }
    await toMute.addRole(role);
    fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
        if(err) throw err;
        console.log(`${toMute.user.tag} has been muted.`)
        if(isNaN(args[1])){
            message.channel.send(`The user ${toMute.user} has been muted by ${message.author.tag}.`)
        }
        else {
            message.channel.send(`The user ${toMute.user} has been muted for ${args[1]} seconds by ${message.author.tag}.`);
        }
    });
}

module.exports.help = {
    name: "mute"
}