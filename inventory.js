const Discord = require('discord.js');
const fs = require("fs");
module.exports.run = async (bot, message, args) => {
    let inventoryOwner = message.author;
    if(!bot.inventory[inventoryOwner.id]){
        bot.inventory[inventoryOwner.id] = {
            guild : message.guild.id,
            Browncoins : 0
        }
        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory), err => {
            if(err) throw err;
            console.log(`${inventoryOwner.tag}'s inventory has been created.`);
        });
    }
    let embed = new Discord.RichEmbed()
        .setAuthor(inventoryOwner.username)
        .setColor("#005EFF")
        console.log(bot.inventory[inventoryOwner.id]);
        for(i in bot.inventory[inventoryOwner.id]){
            console.log(i)
            if(i == "Browncoins"){
                embed.addField(`__${i}__ :`, bot.inventory[inventoryOwner.id].Browncoins, true);
            }
        }
    message.channel.send({embed:embed})
}

module.exports.help = {
    name: "inventory"
}