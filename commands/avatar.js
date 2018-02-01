const Discord = require('discord.js'); 
module.exports.run = async (bot, message, args) => {
    let toAva = message.mentions.users.first() || message.author;
    if(!toAva) return message.channel.send("Specify a user mention.");
    let embed = new Discord.RichEmbed()
        .setTitle(toAva.username)
        .setImage(toAva.displayAvatarURL)
        .setColor("#633092")
    message.channel.send({embed: embed});
}

module.exports.help = {
    name: "avatar"
}
