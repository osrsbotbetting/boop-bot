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
const start = "⚔";
const close = "❌";
const join = "🤝";
module.exports.run = async (bot, message, args) => {
    if(!args[0] || Number(args[0]) == NaN || !(args[0] > 0 && args[0] < 4)) return message.channel.send("Please select a valid Raid difficulty.");
    raidCreator = message.author;
    raiders = [raidCreator];
    var raiderstring = ``;
    if(!bot.inventory[raidCreator.id]){
        return message.channel.send("You may not party yet");
    }
    else if(bot.raidCD[raidCreator.id]){
        return message.channel.send(`You may not create a party yet : t- ${(bot.raidCD[raidCreator.id].time - Date.now())/60000} minutes`);
    }
    var foods = ["Cookies", "Donuts", "Pringles", "Coke", "Pepsi", "CannedBeans", "Hamburgers", "Pizzas", "Pies", "Brownies"];
    var possibleitems = [];
    
    var necks =["Choker", "RubyPendant", "OpalNecklace", "Belt", "GoldPendant", "DiamondNecklace",
    "BrownPendant", "EthernetNecklace", "WettPendant", "Noose"];
    var neckHealth = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    var neckHP = 0;

    var monsters = ["Black Creator", "Hydra", "Typhon"];

    var monsterlevel = [25, 50, 75];
//maybe an if for depending on raid *15,20,25
    var monsterHP = (monsterlevel[args[0]-1]* 10)*args[0] + (monsterlevel[args[0]-1] * 20);
    var adventurerHP = 0;
    var adventurerlevel = 0;
    var adventurerwepdmg = 0;
    var weapons = ["Stick", "WoodenSword", "RatFlail", "Knife", "MetalPipe", "Rapier", "LongBow", "MetalFlail",
    "PyriteScythe", "SpellBook", "Sai", "LongSword", "RubberWand", "Whip", "Lance",
    "Crossbow","Halberd", "Katar", "QuartzStaff", "Chakram", "Katana", "SteelAxe", "Flamethrower",
    "DiamondDagger", "GoldenSword", "AmethystScepter", "MiniatureCannon", "GoldenSai", "Pistol",
    "MetalPlayingCards", "SniperRifle", "AncientStick", "GoldenGun", "Lightsaber", "KNOWLEDGE"];
    var weapondamage = [1, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54,
        57, 60, 64, 67, 71, 74, 78, 81, 85, 88, 92, 95, 99, 102];

//sending Raid request
    let msg = await message.channel.send("```asciidoc\n" + `[Raid Party]\n` +
    `${raidCreator.tag} has created a Raid Party to fight: ${monsters[args[0]-1]}.\n🤝 to join\n` + "\n```");
    await msg.react(join);

    var reactions1 = await msg.awaitReactions((reaction, user) => reaction.emoji.name == join && user.id != bot.user.id, {max : 3, time: 10000})
    .then(bot.on('messageReactionAdd', (reaction, user) => {
    if((reaction.emoji.name === "🤝" && user.id != bot.user.id) && !raiders.includes(user)){
            raiders.push(reaction.users.last());
            console.log(`${raiders.length} raiders: ${raiders}`)

        }
    }));
    await msg.clearReactions();
    for(i in raiders){
        raiderstring += `\n${Number(i)+1}. ${raiders[i].username}`;
    }
    console.log(raiderstring);
    msg.edit("```asciidoc\n" + `[Raid Party]\n` + `⚔ to start, ❌ to cancel\n` +
    `${raiderstring}` + "\n```");
    await msg.react(start);
    await msg.react(close); 
    var reactions2 = await msg.awaitReactions((reaction, user) => (reaction.emoji.name == start || reaction.emoji.name == close) && user.id == raidCreator.id, {max : 1, time: 10000});
    if(reactions2.get(start) == undefined && reactions2.get(close) == undefined ){
        console.log("1");
        msg.clearReactions();
        return msg.edit("The Raid Party has disbanded : Leader inactive...");
    }
    else if(reactions2.get(close) != undefined){
        console.log("2");
        msg.clearReactions();
        return msg.edit(`${raidCreator.tag} has disbanded the party...`);
    }
    else if(reactions2.get(start) != undefined){
        msg.clearReactions();
        msg.edit("```asciidoc\n" + `[Raid Party]\n` +
        `${raiderstring}` + "\nThe party has set off...\n```");
    }


    for(x in raiders){
        var neckHP = 0;
        for(i in bot.inventory[raiders[x].id]){
            if(i != "guild" && i != "name" && i != "weapon" && i != "neck"){
                possibleitems.push(i);
            }
        }
        for(i in foods){
            possibleitems.push(foods[i]);
        }
        for(i in necks){
            if(necks[i] == bot.inventory[raiders[x].id].neck){
                neckHP = neckHealth[i];
            }
        }
        if(bot.inventory[raiders[x].id].weapon == "" ){
            adventurerwepdmg += 0;
        }
        else{
            for(i in weapons){
                if(weapons[i] == bot.inventory[raiders[x].id].weapon){
                    adventurerwepdmg += weapondamage[i];
                }
            }
            console.log(weapondamage);
        }
        adventurerHP += bot.levelD[raiders[x].id].level;
        adventurerlevel += bot.levelD[raiders[x].id].level;
        if(!bot.levelD[raiders[x].id].bossesdefeated){
            bot.levelD[raiders[x].id].bossesdefeated = 0;
            fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                if(err) throw err;
                console.log(`${raiders[x].tag}'s profile has been updated.`);
            });
        }
    }
    adventurerHP *= 10;
    adventurerHP += neckHP;
    // console.log(possibleitems, finds);
    console.log(bot.raidCD);       
    console.log(monsters[args[0]-1], monsterlevel[args[0]-1], monsterHP, adventurerlevel, adventurerHP);

    function win_check(attacker, attackerlevel, attackerHP, defender, defenderlevel, defenderHP, raiders){
        if(defenderHP <= 0 ){
            done = true;
            let resultmessage = "```md\n# Raid Complete #" + `\nThe party(${adventurerHP}hp) defeated Lv${monsterlevel[args[0]-1]} ${monsters[args[0]-1]}`;
            if(bot.levelD[attacker] && bot.inventory[attacker]){
                console.log(possibleitems);
                for(i in raiders){
                    console.log(i);
                    let finds = randomInt(1,100);
                    console.log(finds);
                    let expgained = Number(randomInt(0,15) + Math.floor(adventurerlevel *.3) + monsterlevel[args[0]-1]);
                    console.log(expgained, adventurerlevel, adventurerlevel*.3, monsterlevel[args[0]-1]);

                    bot.levelD[raiders[i].id].bossesdefeated += 1;
                    bot.levelD[raiders[i].id].exp += expgained;
                    bot.levelD[raiders[i].id].level = Math.floor(0.2 * Math.sqrt(bot.levelD[raiders[i].id].exp)) + 1;
                    resultmessage += `\n\nLv${bot.levelD[raiders[i].id].level} ${raiders[i].tag} has gained ${expgained} Exp`;
                    fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                        if(err) throw err;

                        console.log(`Data saved.`);
                    });
                    if(finds <= 4){
                        let itemfound = possibleitems[randomInt(0,possibleitems.length-1)];
                        if(bot.inventory[raiders[i].id][itemfound]){
                            bot.inventory[raiders[i].id][itemfound] += 1;
                        }
                        else{
                            bot.inventory[raiders[i].id][itemfound] = 1;
                        }
                        resultmessage += ` and 1 ${itemfound}`;
                        if(i == raiders.length-1){
                            resultmessage += "\n```";
                            return message.channel.send(resultmessage);
                        }
                        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                            if(err) throw err;
                            console.log(`Itemfound`);
                        });
                    }
                    else{
                        let coinswon = randomInt(0,Math.floor(20 + monsterlevel[args[0]-1] * .5)) + monsterlevel[args[0]-1];
                        bot.inventory[raiders[i].id].Browncoins += coinswon;
                        resultmessage += ` and ${coinswon} Browncoins`
                        if(i == raiders.length-1){
                            resultmessage += "\n```";
                            return message.channel.send(resultmessage);
                        }
                        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                            if(err) throw err;
                            console.log(`Currency saved.`);
                        });
                    }
                }
            }
            else{
                if(attackerHP <= Math.floor((attackerlevel*15)*.35)){
                    let resultmessage = "```md\n# Raid Complete #" + `\nThe Lv${monsterlevel[args[0]-1]}(${monsterHP}hp) ${monsters[args[0]-1]} defeated the party`;
                    for(i in raiders){
                        let expgained = Number(randomInt(0,15) + Math.floor(adventurerlevel *.3) + monsterlevel[args[0]-1]);
                        console.log(expgained, adventurerlevel, adventurerlevel*.3, monsterlevel[args[0]-1]);
                        bot.levelD[raiders[i].id].exp += Math.floor(expgained/2);
                        bot.levelD[raiders[i].id].level = Math.floor(0.2 * Math.sqrt(bot.levelD[raiders[i].id].exp)) + 1;

                        fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                            if(err) throw err; 
                            console.log(`Data saved.`);
                        });
                        let coinslost = randomInt(0,15) + Math.floor(monsterlevel[args[0]-1] + bot.levelD[raiders[i].id].level*.5);
                        if(bot.inventory[raiders[i].id].Browncoins - coinslost < 0){
                            coinslost = bot.inventory[raiders[i].id].Browncoins;
                        }
                        bot.inventory[raiders[i].id].Browncoins -= coinslost;
                        resultmessage += `\n\nLv${bot.levelD[raiders[i].id].level} ${raiders[i].tag} has gained ${Math.floor(expgained/2)} Exp and lost ${coinslost} Browncoins from raiding.`;
                        if(i == raiders.length-1){
                            resultmessage += "\n```";
                            return message.channel.send(resultmessage);
                        }
                        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                            if(err) throw err;
                            console.log(`Currency saved.`);
                        });
                    }
                }
                else{
                    let resultmessage = "```md\n# Raid Complete #" + `\nThe Lv${monsterlevel[args[0]-1]}(${monsterHP}hp) ${monsters[args[0]-1]} < REKT > the party`;
                    for(i in raiders){
                        let expgained = Number(randomInt(0,15) + Math.floor(adventurerlevel *.3) + monsterlevel[args[0]-1]);
                        console.log(expgained, adventurerlevel, adventurerlevel*.3, monsterlevel[args[0]-1]);
                        bot.levelD[raiders[i].id].exp += Math.floor(expgained/3.5);
                        bot.levelD[raiders[i].id].level = Math.floor(0.2 * Math.sqrt(bot.levelD[raiders[i].id].exp)) + 1;

                        fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                            if(err) throw err; 
                            console.log(`Data saved.`);
                        });
                        let coinslost = randomInt(0,15) + Math.floor(monsterlevel[args[0]-1] + bot.levelD[raiders[i].id].level);
                        if(bot.inventory[raiders[i].id].Browncoins - coinslost < 0){
                            coinslost = bot.inventory[raiders[i].id].Browncoins;
                        }
                        bot.inventory[raiders[i].id].Browncoins -= coinslost;
                        resultmessage += `\n\nLv${bot.levelD[raiders[i].id].level} ${raiders[i].tag} has gained ${Math.floor(expgained/3)} Exp and lost ${coinslost} Browncoins from raiding.`;
                        if(i == raiders.length-1){
                            resultmessage += "\n```";
                            return message.channel.send(resultmessage);
                        }
                        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                            if(err) throw err; 
                            console.log(`Currency saved.`);
                        });
                    }
                }
            }
        }  
    }
    async function play(attacker, attackerlevel, attackerHP, defender, defenderlevel, defenderHP, raiders){
        if(bot.levelD[attacker] && bot.inventory[attacker]){
            // //if i want Logs
            // // await message.channel.send(
            // //     "```html\n" + `Lv${attackerlevel} <${attacker.username} (${attackerHP}hp)>\n`+ 
            // //     `Dealt ${attackerdamage} damage to the Lv${defenderlevel} <${defender} (${defenderrHP}hp)>.`
            // //     + "```"
            // // );
            // var adventurerwepdmg = 0;
            // if(bot.inventory[raiders[i].id)].weapon == "" ){
            //     adventurerwepdmg += 0;
            // }
            // else{
            //     for(let i in weapons){
            //         if(weapons[i] == bot.inventory[raiders[i].id)].weapon){
            //             adventurerwepdmg += weapondamage[i];
            //         }
            //     }
            // }
            var attackerdamage = Math.floor(((5 + Math.sqrt(adventurerlevel)*2) + adventurerwepdmg + randomInt(-5,10)));
            if(attackerdamage <= 0){
                attackerdamage = Math.floor(((randomInt(1,5) + Math.sqrt(adventurerlevel)*2) + adventurerwepdmg)/2);
            }
            console.log(`turn = ${turn} attacker = ${bot.inventory[attacker].name} attackerHP = ${attackerHP} damage = ${attackerdamage} defender = ${defender} defenderHP = ${defenderHP}`);
        }
        else{
            // await message.channel.send(
            //     "```html\n" + `Lv${attackerlevel} <${attacker} (${attackerHP}hp)>\n`+ 
            //     `Dealt ${attackerdamage} damage to the Lv${defenderlevel} <${defender} (${defenderrHP}hp)>.`
            //     + "```"
            // );
            var attackerdamage = monsterlevel[args[0]-1] + randomInt(5,20);
            console.log(`turn = ${turn} attacker = ${attacker} attackerHP = ${attackerHP} damage = ${attackerdamage} defender = ${bot.inventory[defender].name} defenderHP = ${defenderHP}`);
        }
        //wait(1500);
        return defenderHP -= attackerdamage;
    }

    var turn = randomInt(0,1);
    console.log(`turn = ${turn} adventurerHP = ${adventurerHP} monsterHP = ${monsterHP}`);
    var done = false;

    while(done == false){
        while(done == false && turn === 0){
            // var adventurerdamage = Math.floor(10 + Math.sqrt(bot.levelD[adventurer.id].level)*2) + adventurerwepdmg + randomInt(-10,15);
            // if(adventurerdamage <= 0){
            //     adventurerdamage = (Math.floor(10 + Math.sqrt(bot.levelD[adventurer.id].level)*2) + adventurerwepdmg)/2;
            // }
            monsterHP = await play(raidCreator.id, adventurerlevel, adventurerHP, monsters[args[0]-1], monsterlevel[args[0]-1], monsterHP, raiders);
            await win_check(raidCreator.id, adventurerlevel, adventurerHP, monsters[args[0]-1], monsterlevel[args[0]-1], monsterHP, raiders);
            turn = 1;
        }
        while(done == false && turn === 1){
            // var monsterdamage = monsterlevel + randomInt(-5,10);
            // if(monsterdamage <= 0){
            //     monsterdamage = monsterlevel/2;
            // }
            adventurerHP = await play(monsters[args[0]-1], monsterlevel[args[0]-1], monsterHP, raidCreator.id, adventurerlevel, adventurerHP, raiders);
            await win_check(monsters[args[0]-1], monsterlevel[args[0]-1], monsterHP, raidCreator.id, adventurerlevel, adventurerHP, raiders);
            turn = 0;
        }
    }

    var cooldown =10000;
    //  Date.now() + 14400000 - Math.pow((.3794733192*(bot.levelD[raidCreator.id].level)),2)*10000;
    // if(cooldown <= 7200000){
    //     cooldown = 7200000;
    // }
    bot.raidCD[raidCreator.id] = {
        guild: message.guild.id,
        time: cooldown
    }
    fs.writeFile("./raidCD.json", JSON.stringify(bot.raidCD, null, 4), err => {
            if(err) throw err;
            return console.log(`${raidCreator.tag} led a raid`);
    });
}

module.exports.help = {
    name: "raid"
}