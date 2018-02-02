const Discord = require('discord.js');
const fs = require("fs");

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function wait(ms){
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

accept = "✅";
decline = "❎";

module.exports.run = async (bot, message, args) => {
    healthZero = 20;
    healthOne = 20;
    var bodyActions = ["licks", "farted on", "puked on", "pissed on", "shat on", "kisses", "rubs", "sucks on", "wetts"];
    var bodyParts = ["foot", "head", "elbow", "thigh", "toes", "thumb", "fingers", "finger", "palm",
        "ear", "nose", "knee", "ankle", "shoulder", "face", "hand", "butt", "belly button"];

    var withActions = ["stabs", "slaps", "pokes", "rubs"];
    var projectileActions = ["throws a", "drop kicks a", "catapults a", "fires a"];
    var firesALaunchers = ["rifle", "pistol", "crossbow", "cannon", "mortar", "BB gun", "slingshot", "long bow"];
    var items = ["rock","spear", "baseball", "hay bale", "book", "wooden crate", "metal box", "pot", "stick", "keyboard",
        "monitor", "spanish dildo", "volleyball", "KNOWLEDGE", "Coke", "Pepsi", "basketball",
        "pencil", "pen", "staple", "ceramic pot", "paperclip", "iPhone 4S", "shuriken"];

    var duelEE = message.author;
    var toDuel = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    
    if( !toDuel && args[1] == undefined && args[0] != "profile"){
        return message.channel.send("Specify a user mention or ID.");
    }
    else if (args[0] == "profile" && !toDuel){
        if(bot.levelD[duelEE.id] == undefined){
            return message.channel.send(`You do not have a profile.`);
        }
        else{        
            console.log("Author's profile");
            var embed = new Discord.RichEmbed()
                .setAuthor(`${duelEE.username}`)
                .setTitle(`Level ${bot.levelD[duelEE.id].level}`)
                .setDescription(`Exp: ${bot.levelD[duelEE.id].exp}\nWins: ${bot.levelD[duelEE.id].wins}\nLosses: ${bot.levelD[duelEE.id].losses}`)
                .setColor("#633092")
                .setThumbnail(duelEE.displayAvatarURL)
            return message.channel.send({embed: embed});
        }
    }
    else if( args[1] == "profile" && toDuel.user.tag != bot.user.tag){
        if(bot.levelD[toDuel.id] == undefined){
            return message.channel.send(`${toDuel.user.tag} does not have a profile.`);
        }
        else{
            console.log("User's profile");
            var embed = new Discord.RichEmbed()
                .setAuthor(`${toDuel.user.username}`)
                .setTitle(`Level ${bot.levelD[toDuel.id].level}`)
                .setDescription(`Exp: ${bot.levelD[toDuel.id].exp}\nWins: ${bot.levelD[toDuel.id].wins}\nLosses: ${bot.levelD[toDuel.id].losses}`)
                .setColor("#633092")
                .setThumbnail(toDuel.user.displayAvatarURL)
            return message.channel.send({embed: embed});
        }
    }
    else if(toDuel.user.tag == bot.user.tag && args[1] == "profile"){
        return message.channel.send("The bot does not have a profile.");
    }
    else if(toDuel.user.tag == bot.user.tag && args[1] != "profile"){
        return message.channel.send("You may not duel the bot.");
    }
    else if(toDuel.user.tag == message.author.tag && args[1] != "profile"){
        return message.channel.send("You may not duel yourself.");
    }

    for(let i in bot.levelD) {
        let guildId = bot.levelD[i].guild;
        let guild = bot.guilds.get(guildId);
        let level = bot.levelD[i].level;
        let exp = bot.levelD[i].exp;
        let wins = bot.levelD[i].wins;
        let losses = bot.levelD[i].losses;
    };
    if (!bot.levelD[toDuel.id]){
        bot.levelD[toDuel.id] = {
            guild: message.guild.id,
            exp: 0,
            level: 1,
            wins: 0,
            losses: 0
        }
    }
    if(!bot.levelD[duelEE.id]){
        bot.levelD[duelEE.id] = {
            guild: message.guild.id,
            exp: 0,
            level: 1,
            wins: 0,
            losses: 0
        }
    }
    fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
        if(err) throw err; 
        console.log(`${toDuel.user.tag} has been challenged to a duel.`)
    });

    function win_check(){
        if(healthZero < 1 ){
            message.channel.send("```md\n" + "# Duel Complete #\n" + `${toDuel.user.tag}(${healthOne}hp) has won the duel against ${duelEE.tag}` + "\n```");
            done = true;
            bot.levelD[toDuel.id].exp += 10;
            bot.levelD[toDuel.id].level = Math.floor(0.2 * Math.sqrt(bot.levelD[toDuel.id].exp)) + 1;
            bot.levelD[toDuel.id].wins += 1;
            bot.levelD[toDuel.id].losses += 0;

            bot.levelD[duelEE.id].exp += 5;
            bot.levelD[duelEE.id].level = Math.floor(0.2 * Math.sqrt(bot.levelD[toDuel.id].exp)) + 1;
            bot.levelD[duelEE.id].wins += 0;
            bot.levelD[duelEE.id].losses += 1;
            fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                if(err) throw err; 
                console.log(`Data saved.`);
            });
        }
        else if(healthOne < 1 ){
            message.channel.send("```md\n" + "# Duel Complete #\n" + `${duelEE.tag}(${healthZero}hp) has won the duel against ${toDuel.user.tag}` + "\n```");
            done = true;
            bot.levelD[toDuel.id].exp += 5;
            bot.levelD[toDuel.id].level = Math.floor(0.2 * Math.sqrt(bot.levelD[toDuel.id].exp)) + 1;
            bot.levelD[toDuel.id].wins += 0;
            bot.levelD[toDuel.id].losses += 1;

            bot.levelD[duelEE.id].exp += 10;
            bot.levelD[duelEE.id].level = Math.floor(0.2 * Math.sqrt(bot.levelD[toDuel.id].exp)) + 1;
            bot.levelD[duelEE.id].wins += 1;
            bot.levelD[duelEE.id].losses += 0;
            fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                if(err) throw err; 
                console.log(`Data saved.`);
            });
        }
    }
    function play(message1, toDuel1, duelEE1, attackerHP, defenderHP, color){
            var specificActions = [`${toDuel1}(${defenderHP}hp) took <${duelEE1} (${attackerHP}hp)> to McDonalds`,
            `<${toDuel1} (${defenderHP}hp)> installed Vosteran on <${duelEE1} (${attackerHP}hp)>'s computer`,
            `<${toDuel1} (${defenderHP}hp)> downvoted <${duelEE1} (${attackerHP}hp)>'s Reddit post`,
            `<${toDuel1} (${defenderHP}hp)> convinced <${duelEE1} (${attackerHP}hp)> to not commit suicide`];
            let scenario = randomInt(0,3);
            console.log(scenario);
            if(scenario == 0){
                withActionSlot = randomInt(0, withActions.length -1);
                itemUsed = randomInt(0, items.length -1);
                if (withActionSlot == 0){
                    damage = randomInt(4,5);
                }
                else if (withActionSlot == 1){
                    damage = randomInt(3,5);
                }
                else{
                    damage = randomInt(3,4);
                }
                console.log(damage, attackerHP, defenderHP)
                // var embed = new Discord.RichEmbed()
                //     .setTitle(`${toDuel1}(${defenderHP}hp)`)
                //     .setDescription(`${toDuel1} ${withActions[withActionSlot]} ${duelEE1}(${attackerHP}hp) with a ${items[itemUsed]} dealing ${damage} damage.`)
                //     .setColor(color)
                // message.channel.send({embed: embed});
                var combatLog = await message1.channel.send(
                    "```html\n" + `<${toDuel1} (${defenderHP}hp)>\n`+ 
                    `<${toDuel1} (${defenderHP})> ${withActions[withActionSlot]} <${duelEE1} (${attackerHP}hp)> with a ${items[itemUsed]} dealing ${damage} damage.`
                     + "```"
                );
                return attackerHP -= damage;

            }
            else if(scenario == 1){
                itemUsed = randomInt(0, items.length -1);
                bodyHit = randomInt(0,bodyParts.length -1);
                projectileActionSlot = randomInt(0,projectileActions.length -1);
                projectile = randomInt(0, firesALaunchers.length-1);

                if(projectileActions[projectileActionSlot] == "fires a"){
                    item = firesALaunchers[projectile];
                }
                else{ item = items[itemUsed]}

                if(bodyParts[bodyHit] == "head" || bodyParts[bodyHit] == "crotch"){
                    damage = 5
                }
                else {damage = randomInt(0,5);}

                if(damage = 0){
                    damageStatement = `missing`;
                }
                else{
                    damage = randomInt(3,5);
                    damageStatement = `dealing ${damage} damage`;
                }
                console.log(damage, attackerHP, defenderHP)
                // var embed = new Discord.RichEmbed()
                //     .setTitle(`${toDuel1}(${defenderHP}hp)`)
                //     .setDescription(`${toDuel1} ${projectileActions[projectileActionSlot]} ${item} aimed at ${duelEE1}(${attackerHP}hp)'s ${bodyParts[bodyHit]}, ${damageStatement}`)
                //     .setColor(color)
                // message.channel.send({embed: embed});
                var combatLog = await message1.channel.send(
                    "```html\n" + `<${toDuel1} (${defenderHP}hp)>\n`+ 
                    `<${toDuel1} (${defenderHP}hp)> ${projectileActions[projectileActionSlot]} ${item} aimed at <${duelEE1} (${attackerHP}hp)>'s ${bodyParts[bodyHit]}, ${damageStatement}`
                     + "```"
                );
                return attackerHP -= damage;

            }
            else if(scenario == 2){
                bodyActionSlot = randomInt(0,bodyActions.length -1);
                bodyHit = randomInt(0,bodyParts.length -1);
                damage = randomInt(3,4);
                console.log(damage, attackerHP, defenderHP)
                // var embed = new Discord.RichEmbed()
                //     .setTitle(`${toDuel1}(${defenderHP}hp)`)
                //     .setDescription(`${toDuel1} ${bodyActions[bodyActionSlot]} ${duelEE1}(${attackerHP}hp)'s ${bodyParts[bodyHit]} dealing ${damage}`)
                //     .setColor(color)
                // message.channel.send({embed: embed});
                var combatLog = await message1.channel.send(
                    "```html\n" + `<${toDuel1} (${defenderHP}hp)>\n`+ 
                    `<${toDuel1} (${defenderHP}hp)> ${bodyActions[bodyActionSlot]} <${duelEE1} (${attackerHP}hp)>'s ${bodyParts[bodyHit]} dealing ${damage}`
                     + "```"
                );
                return attackerHP -= damage;
                
            }
            else if(scenario == 3){
                damage = randomInt(3,4);
                specificActionsSlot = randomInt(0,specificActions.length-1);
                // console.log(damage, attackerHP, defenderHP)
                // var embed = new Discord.RichEmbed()
                //     .setTitle(`${toDuel1}(${defenderHP}hp)`)
                //     .setDescription(`${specificActions[specificActionsSlot]}, dealing ${damage}`)
                //     .setColor(color)
                // message.channel.send({embed: embed});
                var combatLog = await message1.channel.send(
                    "```html\n" + `<${toDuel1} (${defenderHP}hp)>\n`+ 
                    `${specificActions[specificActionsSlot]}, dealing ${damage}`
                     + "```"
                );
                return attackerHP -= damage;
            } 
    }
    //sending and accepting/declining duel
    let msg = await message.channel.send(`The user ${toDuel} has been challenged to a duel by ${message.author.tag}. React with :white_check_mark: or :negative_squared_cross_mark: within 10 seconds.`);
    await msg.react(accept);
    await msg.react(decline);

    var reactions = await msg.awaitReactions((reaction, user) => (reaction.emoji.name == accept || reaction.emoji.name == decline) && user.id == toDuel.user.id, {max : 1, time: 10000});

    console.log(`Reactions collected ${reactions.size }, ${reactions.get(accept)} ${reactions.get(decline)}`);
    if(reactions.get(accept) == undefined && reactions.get(decline) == undefined ){
        console.log("1");
        msg.clearReactions();
        return msg.edit("The duel request has expired.");
    }
    else if (reactions.get(accept) == undefined && reactions.get(decline) != undefined ){
        console.log("2");
        msg.clearReactions();
        return msg.edit(`${toDuel.user.tag} has declined the duel from ${message.author.tag}`);
    }
    else if(reactions.get(accept) != undefined && reactions.get(decline) == undefined){
        msg.clearReactions();
        msg.edit(`${toDuel.user.tag} has accepted the duel from ${message.author.tag}`);
        var turn = randomInt(0,1);

        var color0 = "#e10606";
        var color1 = "#e74600";
        console.log(`turn = ${turn} healthZero = ${healthZero} healthOne = ${healthOne}`);
        var done = false;
    }

    
    while(done == false){

        while(done == false && turn === 0){
            healthOne = play(message, duelEE.username, toDuel.user.username, healthOne, healthZero, color0);
            await win_check();
            turn = 1;
        }

        while(done == false && turn === 1){
            healthZero = play(message, toDuel.user.username, duelEE.username, healthZero, healthOne, color1);
            await win_check();
            turn = 0;
        }
    }
    return;
}

module.exports.help = {
    name: "duel"
}
