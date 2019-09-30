const Discord = require('discord.js');
const fs = require("fs");

const accept = "✅";
const decline = "❎";

module.exports.run = async (bot, message, args) => {
    let personOne = message.author;
    let personTwo = message.mentions.users.first() || message.guild.members.get(args[0]);
    if(!personTwo) return message.channel.send("Specify a person to trade.");
    //if(personOne.id == personTwo.id) return message.channel.send("Please do not trade stuff to yourself. It's sad, really.");
    if(!bot.inventory[personOne.id]) return message.channel.send("You do not have an inventory to trade from.");
    if(!bot.inventory[personTwo.id]) return message.channel.send(`${personTwo.user.username} does not have an inventory to trade items.`);
    if(!personTwo || !args[1] || !args[2] || !args[3] || !args[4]) return message.channel.send("Specify a person, item, or quantity.");

    if(!bot.inventory[personOne.id][args[1]] || bot.inventory[personOne.id][args[1]] == 0){
        return message.channel.send(`You do not have any ${args[1]} to trade.`);
    }
    if(bot.inventory[personOne.id][args[1]] - Number(args[2]) < 0 ){
        return message.channel.send(`You do not have ${args[2]} ${args[1]} to trade.`);
    }
    if(bot.inventory[personTwo.id][args[3]] - Number(args[4]) < 0 ){
        return message.channel.send(`${personTwo.tag} does not have ${args[4]} ${args[3]} to trade.`);
    }
    //sending and accepting/declining trade
    let msg = await message.channel.send(`${personOne.tag} has offered to trade their ${args[2]} ${args[1]}(s) for ${personTwo.username}'s ${args[4]} ${args[3]}`);
    await msg.react(accept);
    await msg.react(decline);

    var reactions = await msg.awaitReactions((reaction, user) => (reaction.emoji.name == accept || reaction.emoji.name == decline) && user.id == personTwo.id, {max : 1, time: 30000});
    console.log(`Reactions collected ${reactions.size }, ${reactions.get(accept)} ${reactions.get(decline)}`);
    
    if(reactions.get(accept) == undefined && reactions.get(decline) == undefined ){
        console.log("1");
        msg.clearReactions();
        return msg.edit("The trade request has expired.");
    }
    else if (reactions.get(accept) == undefined && reactions.get(decline) != undefined ){
        console.log("2");
        msg.clearReactions();
        return msg.edit(`${personTwo.tag} has declined the trade from ${personOne.tag}`);
    }
    else if(reactions.get(accept) != undefined && reactions.get(decline) == undefined){
        msg.clearReactions();
        msg.edit(`${personTwo.tag} has accepted the trade from ${personOne.tag}`);

        bot.inventory[personOne.id][args[1]] -= Number(args[2]);
        if(!bot.inventory[personTwo.id][args[1]]){
            bot.inventory[personTwo.id][args[1]] = Number(args[2]);
        }
        else{
            bot.inventory[personTwo.id][args[1]] += Number(args[2]);
        }

        bot.inventory[personTwo.id][args[3]] -= Number(args[4]);
        if(!bot.inventory[personOne.id][args[3]]){
            bot.inventory[personOne.id][args[3]] = Number(args[4]);
        }
        else{
            bot.inventory[personOne.id][args[3]] += Number(args[4]);
        }

        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
            if(err) throw err;
            message.channel.send("```ml" + `\n${personOne.username} gained ${args[4]} ${args[3]} & lost ${args[2]} ${args[1]}`+
            `\n${personTwo.username} gained ${args[2]} ${args[1]} & lost ${args[4]} ${args[3]}` + "\n```");
            console.log(`${personOne.tag} traded with ${personTwo.tag}`);
        });
    }
    
}

module.exports.help = {
    name: "trade"
}