const Discord = require('discord.js');
const fs = require("fs");
module.exports.run = async (bot, message, args) => {
    var purchaser = message.author
    var items = ["Cookies", "Donuts"];
    var itemCost = [60, 120];
    if(!args[0]){
        var embed = new Discord.RichEmbed()
            .setColor("#61eeaa")
            .setTitle("Shop")
        for(let i in items){
            embed.addField(items[i], `Cost: ${itemCost[i]}`, true)
        }
        message.channel.send({embed:embed});
    }
    else if(args[0] == "buy"){
        if(!args[1] || isNaN(args[2])) return message.channel.send("No item or quantity selected.");
        for(let i in items){
            if(args[1] == items[i]){
                if(bot.inventory[purchaser.id].Browncoins <= itemCost[i]){
                    return message.channel.send("You do not have enough Browncoins.");  
                }
                else{
                    bot.inventory[purchaser.id].Browncoins -= itemCost[i];
                    if(!bot.inventory[purchaser.id][args[1]]){
                        bot.inventory[purchaser.id][args[1]] = Number(args[2]);
                    }
                    else{
                        bot.inventory[purchaser.id][args[1]] += Number(args[2]);
                    }
                    fs.writeFile("./inventory.json", JSON.stringify(bot.inventory), err => {
                        if(err) throw err;
                        message.channel.send(`You have purchased ${args[2]} ${args[1]}`);
                        console.log(`${purchaser.tag} has purchased ${args[2]} ${args[1]}`);
                    });
                }
            }
        }
    }
}

module.exports.help = {
    name: "shop"
}