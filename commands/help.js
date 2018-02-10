const Discord = require('discord.js'); 
const fs = require('fs');
const prefix = "!";
module.exports.run = async (bot, message, args) => {
    var clist = [];
    var cinfo = [" @ : Displays user's avatar",
    " (@)/(profile) : Duels another user/view dueling (profiles/history)",
    " : Displays Bot commands",
    " : Create/Check your inventory",
    " @/# : Mutes a user",
    "(cc/ud/mc)/#/?/ans : Create a poll",
    "#~#(')#') : Generates a random number in range",
    " @ : Unmutes a user",
    " @/Id : Displays user's info",
    " : Check your balance"
    ];
    fs.readdir("./commands/", (err, files) => {
        if(err) console.error(err);
        let cfiles = files.filter(f => f.split(".").pop() === "js");
        cfiles.forEach((f, i) => {
            clist.push(`\`${prefix + f.split(".").splice(0, 1)}\``);
        });
        for(i in clist){
            clist[i] += cinfo[i];
        }
        console.log(clist.join('\n'))
        let embed = new Discord.RichEmbed()
            .setColor("#61eeaa")
            .setAuthor("Bot Commands")
            .setDescription(clist);
            
        message.channel.send({embed: embed});
    });

}

module.exports.help = {
    name: "help"
}
