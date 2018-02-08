const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let command = message.content.split(" ");
    delete command.splice(0,1);
    let generators = [];
    let generator = [];

    for(i in command){
        generators.push(command[i].split("~"));
    }

    function randomNG(min, max){
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(generators, result);
        return `(${min}~${max})`;
    }
    var embed = new Discord.RichEmbed()
    embed.setTitle("RNG")
    embed.setColor("#00abff");
    for( i in generators){
        let generator = generators[i];
        embed.addField(randomNG(parseInt(generator[0]), parseInt(generator[1])), result, true);
    }
    message.channel.send({embed: embed});
}

module.exports.help = {
    name: "rng"
}