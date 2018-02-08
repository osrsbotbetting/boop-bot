const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let command = message.content.split(" ");
    delete command.splice(0,1);
    let generators = [];
    let generator = [];
    let multiple = [];
    console.log(command);    
    for(i in command){
        multiple.push(command[i].split(")").pop());
        range = command[i].split(")").splice(0,1).join();
        generators.push(range.split("~"));
    }
    console.log(multiple);console.log(generators);console.log(range);   
    function randomNG(min, max, i){
        results = [];
        for(let x=0; x<multiple[i]; x++){
            let result = Math.floor(Math.random() * (max - min + 1)) + min;
            results.push(result);
        }
        console.log(generators, results, min, max);
        return `(${min}~${max})`;
    }
    var embed = new Discord.RichEmbed()
    embed.setTitle("RNG")
    embed.setColor("#00abff");
    for( i in generators){
        let generator = generators[i];
        embed.addField(randomNG(parseInt(generator[0]), parseInt(generator[1]),i), results, true);
    }
    return message.channel.send({embed: embed});
}

module.exports.help = {
    name: "rng"
}
