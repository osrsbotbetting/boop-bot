const Discord = require('discord.js');
module.exports.run = async (bot, message, args) => {
    let toInfo = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toInfo) return message.channel.send("Specify a user mention or ID.");
    let embed = new Discord.RichEmbed()
        .setTitle(toInfo.user.username)
        .setThumbnail(toInfo.user.displayAvatarURL)
        .setColor("#633092")
        .addField("Full Username", `${toInfo.user.username}#${toInfo.user.discriminator}`)
        .addField("ID", toInfo.user.id)
        .addField("Created On", toInfo.user.createdAt);
    message.channel.send({embed: embed});
}

module.exports.help = {
    name: "userinfo"
}