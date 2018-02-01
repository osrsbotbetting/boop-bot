
module.exports.run = async (bot, message, args) => {
    let timer = args[1]*60000;
    if (isNaN(timer)){
        return message.channel.send("Invalid time parameter.");
    }

    if(args[0]== "cc"){
        var agree = "✅";
        var disagree = "❎";
    }
    else if(args[0]== "ud"){
        var agree = "👍";
        var disagree = "👎";
    }
    var questionInput = message.content.split(" ");
    delete questionInput.splice(0,3);
    var question = questionInput.join(" ");

    var msg = await message.channel.send("```asciidoc\n[ Poll ]" + `\n${question}`+ "\n```");
    await msg.react(agree);
    await msg.react(disagree);

    var reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: timer});
    
    if (reactions.get(agree) == undefined && reactions.get(disagree).count-1 == 0){
        msg.clearReactions();
        return msg.edit("```diff\n- Poll expired -" + `\n${question}` + "\n- No votes were casted -```");
    }
    else if(reactions.get(agree) == undefined && reactions.get(disagree).count-1 == 1){
        msg.clearReactions();
        return msg.edit("```diff\n- Poll Expired -\n```" + "\n```asciidoc\n= Poll Results =" + `\n${question}` + `\n\n${agree}: 0\n\n${disagree}: ${reactions.get(disagree).count-1}` + "\n```");
    }
    console.log(reactions.get(agree).count-1, reactions.get(disagree).count-1);
    msg.clearReactions();
    return msg.edit("```diff\n- Poll Expired -\n```" +  "\n```asciidoc\n= Poll Results =" + `\n${question}` + `\n\n${agree}: ${reactions.get(agree).count-1}\n\n${disagree}: ${reactions.get(disagree).count-1}` + "\n```");
}

module.exports.help = {
    name: "poll"
}