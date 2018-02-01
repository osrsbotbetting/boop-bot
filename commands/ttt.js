const Discord = require('discord.js'); 
module.exports.run = async (bot, message, args) => {
    let tttMode = message.mentions.users.first() || message.author;
    if (!tttMode) return message.channel.send("Specify a correct user mention.");
    if (tttMode == message.mentions.users.first()){
        var mode = 2;
    }
    else {
        var mode = 1;
    }
    //import string;
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    function randomLetter() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";    
        //for (var i = 0; i < 1; i++)
        text = possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var spot = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var csmarter = 0;
    var counter = 0;
    //var mode = 0;
    var move = 0;
    var difficulty = "";
    var done = false;
    var into_rounds = false;

    function board(){
        let embed = new Discord.RichEmbed()
            .setTitle("Board:")
            .setDescription(`${spot[0]},  ${spot[1]},  ${spot[2]}, \n${spot[3]},  ${spot[4]},  ${spot[5]}, \n${spot[6]},  ${spot[7]},  ${spot[8]}`)
            .setColor("#09d22b");
        message.channel.send({embed: embed});
        /*message.channel.send(spot[0], spot[1], spot[2])
        message.channel.send(spot[3], spot[4], spot[5])
        message.channel.send(spot[6], spot[7], spot[8])*/
    }
    function who_turn(){
        //states turn Global first, mode
        console.log("Turn determined");
        if ((first == 0 && mode == 1) || (counter == 1 && first == 4 && mode == 1)){
            message.channel.send(`Your(${psymbol}) turn.`);
            play(psymbol);
            first = 4;
        }
        else if ((first == 0 && mode == 2) || (counter == 1 && first == 5 && mode == 2)){
            message.channel.send(`Player 1's(${psymbol}) turn.`);
            play(psymbol);
            first = 5;
        }
        else if ((first == 1 && mode == 1) || (counter == 3 && first == 4 && mode == 1)){
            counter = 3;
            message.channel.send(`Computer's(${csymbol}) turn.`);
            cplay();
            first = 4;
        }
        else if ((first == 1 && mode == 2) || (counter == 2 && first == 5 && mode == 2)){
            message.channel.send(`Player 2's(${p2symbol}) turn.`);
            play(p2symbol);
            first = 5;
        }
        else{
            console.log("Turn cannot be determined"); return;
        }
    }
    function cplay(){ //this one may be confusing :^)
        //global csmarter, CONDITIONS, counter, dificulty, engineer_bap, spot
        let played = false;
        let the_move = [0,1,2];
        let i = 0;
        if (difficulty == "2"){
            while (!played){
                for (i < 7; i++; ){ //in range = (i<7; i++)
                    let please = CONDITIONS[i];
                    //if a=b a=c b=c a!=b!=c
                    if ((spot[please[0]] == spot[please[1]] != spot[please[2]] || spot[please[0]] != spot[please[1]] == spot[please[2]] || spot[please[0]] == spot[please[2]] != spot[please[1]]) && (spot[please[0]] != spot[please[1]] != spot[please[2]])){
                        the_move = please;
                    //i += 1;
                    }
                }
                if (spot[the_move[0]] == spot[the_move[1]] && spot[the_move[2]] == engineer_bap[the_move[2]]){
                    cmove = the_move[2];
                    spot[cmove] = csymbol;
                    counter = 1;
                    played = true;
                }
                else if (spot[the_move[0]] == spot[the_move[2]] && spot[the_move[1]] == engineer_bap[the_move[1]]){
                    cmove = the_move[1];
                    spot[cmove] = csymbol;
                    counter = 1;
                    played = true;
                }
                else if (spot[the_move[1]] == spot[the_move[2]] && spot[the_move[0]] == engineer_bap[the_move[0]]){
                    cmove = the_move[0];
                    spot[cmove] = csymbol;
                    counter = 1;
                    played = true;
                }
                else if (!played && counter == 3){
                    cmove = randomInt(0, 8);
                    while (!played){
                        if (spot[cmove] != `${cmove + 1}`){
                            cmove = randomInt(0, 8);
                        }
                        else{
                            counter = 1;
                            spot[cmove] = csymbol;
                            played = true;
                            console.log("Computer played");
                        }
                    }
                }
            }
        }
        else if (difficulty == "1"){
            cmove = randomInt(0, 8);
            played = false;
            while (!played){
                if (spot[cmove] != `${cmove + 1}`){
                    cmove = random.randint(0, 8);
                }
                else{
                    counter = 1;
                    spot[cmove] = csymbol;
                    played = true;
                    console.log("Computer played");
                }
            }
        }
    }
    const CONDITIONS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    function win_check(){
        //global CONDITIONS
        for ([a, b, c] in CONDITIONS){
            if (spot[a] == spot[b] == spot[c]){
                if (mode == 1){
                    if (spot[b] == psymbol){
                        board();
                        message.channel.send(`Congratz, You(${psymbol}) Won!`);
                        restart();
                    }
                    else {
                        board();
                        message.channel.send(`The Computer(${csymbol}) Won, You Lose.`);
                        restart();
                    }
                }
                else if (mode == 2){
                    if (spot[b] == psymbol){
                        board();
                        message.channel.send(`Player One(${psymbol}) Won!`);
                        restart();
                    }
                    else{
                        board();
                        message.channel.send(`Player Two(${p2symbol}) Won!`);
                        restart();
                    }
                }
            }
        }
    }
    function restart(){
        //global counter, csmarter, into_rounds, mode, spot
        counter = 0;
        csmarter = 0;
        into_rounds = false;
        spot = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        // let again = "";
        message.channel.send("Restart(Y)    Menu(Any other letters except 'Y'): ")
        .then(() => {
            message.channel.awaitMessages(response => response.content != 'Y', {
                max :1,
                time: 10000,
                errors: ['time'],
            })
            .then((collected) => {
                if (collected.first().content != "Y"){
                    //message.channel.send()
                    //mode = 0;
                    return;
                }           
            })
            .catch(() => {
                message.channel.send('There was no collected message that passed the filter within the time limit!');
                return;
              });
        });
    }
    function play(symbol){
        //global counter
        let symbol_copy = symbol;
        console.log("Player's turn");
        message.channel.send("Pick a spot (1-9)")
        .then(() => {
            message.channel.awaitMessages(response => response.content.length == 1, {
                max :1,
                time: 10000,
                errors: ['time'],
            })
            .then((collected) => {
                move = collected.content;
            })
            .catch(() => {
                message.channel.send('There was no collected message that passed the filter within the time limit!');
                console.log("No move respose received");
            });
        });
        //move = message.content;
        let played = false;
        while (!played){
            if (move.length != 1 || spot[parseInt(move)-1] != move){
                message.channel.send("Sorry, that spot has been taken or is not on the board. \n Pick a spot (1-9): " )
                .then(() => {
                    message.channel.awaitMessages(response => response.content.length == 1, {
                        max :1,
                        time: 10000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        move = collected.content;
                      })
                    //move = moveResponse
                    .catch(() => {
                        message.channel.send('There was no collected message that passed the filter within the time limit!');
                        console.log("No Move respose received");
                        return;
                  });
                });
            }
            else {played = true}
        }
        if (mode == 1){
            spot[int(move)-1] = symbol;
            counter = 3;
        }
        else if (mode == 2){
            spot[int(move)-1] = symbol;
            if (symbol_copy == p2symbol){
                counter = 1;
            }
            else if (symbol_copy == psymbol){
                counter = 2;
            }
        }
    }
    var engineer_bap = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    function move_check(){
        //   ;)   checks whole board for available moves
        //global engineer_bap
        let sentry_gun = 0;
        let k = 0;
        for ( k < 9; k++; ){
            if (spot[k] != engineer_bap[k]){
                sentry_gun += 1;
            // k += 1;
            }
        }
        if (sentry_gun == 9){
            message.channel.send("Draw!")
            restart()
        }
    }
    while (!done){
        /*menu
        while (mode == 0){
            //Game mode selection
            message.channel.send("<Please select a gamemode>")
            mode = int(prompt("Single Player(1) or Two Player(2): "));
            while (mode != 1 && mode != 2){
                message.channel.send("Please enter a valid number")
                mode = int(prompt("Single Player(1) or Two Player(2): "));
            }
        }*/
        //Single player
        while (mode == 1){
            var first = randomInt(0, 1);
            var arg1 = args[0];
            if (arg1.length == 1 && possible.includes(args[0].toUpperCase())){
                var psymbol = args[0].toUpperCase();
            }
            else{
                console.log("nope");
                return;
            }

            if (args[1] == 1){
                difficulty = 1;
            }
            else if(args[1] == 2){
                difficulty = 2;
            }
            else{ 
                message.channel.send("Incorrect Difficulty input.");
                console.log("Incorrect Difficulty input.");
                return;
            }
            console.log(psymbol, difficulty);
            // message.channel.send("Select Computer difficulty - Easiest(1) Easy(2): ")
            // .then(() => {
            //     message.channel.awaitMessages(response => response.content == "1" || response.content == "2", {
            //         max: 1,
            //         time: 10000,
            //         errors:['time'],
            // })
            // .then((collected) => {
            //     difficulty = collected.first().content;
            // })
            //   .catch(() => {
            //     message.channel.send('There was no collected message that passed the filter');
            //     console.log("No Difficulty response received")
            //   });
            // });

            // while ((difficulty != "1" && difficulty != "2") || len(difficulty) != 1){
            //     message.channel.send("Please select a difficulty(1 or 2).")
            //     difficulty = prompt("Select Computer difficulty - Easiest(1) Easy(2): ").toUpperCase();
            // }
            //picking symbol
            // message.channel.send("Pick your symbol (letter):" )
            // .then(() => {
            //     message.channel.awaitMessages(response => response.content.length == 1 , {
            //         max: 1,
            //         time: 10000,
            //         errors:['time'],
            // })
            // .then((collected) => {
            //     if (possible.includes(collected.content.toUpperCase())){
            //         var psymbol = collected.first().content
            //     }
            // })
            //   .catch(() => {
            //     message.channel.send('There was no collected message that passed the filter');
            //     console.log("No Symbol response received")
            //   });
            // });

            // while ((psymbol).isdigit() || len(psymbol) != 1){
            //     message.channel.send("Pick your symbol (letter):" )
            //     .then(() => {
            //         message.channel.awaitMessages(response => response.content.length == 1 , {
            //             max: 1,
            //             time: 10000,
            //             errors:['time'],
            //     })
            //     .then((collected) => {
            //         if (possible.includes(collected.content.toUpperCase())){
            //             var psymbol = collected.first().content
            //         }
            //     })
            //       .catch(() => {
            //         message.channel.send('There was no collected message that passed the filter');
            //         console.log("No Symbol response received")
            //       });
            //     });
            // }
            var csymbol = randomLetter();
            console.log(csymbol);
            while (csymbol == psymbol){
                csymbol = randomLetter();
            }
            into_rounds = true;
            while (into_rounds){
                board()
                console.log("Board printed")
                move_check()
                console.log("Draw checked")
                who_turn()

                message.channel.send(" ")
                win_check()
                console.log("Win checked")
            }
        }
        //Two Player
        while (mode == 2){
            let first = randomInt(0,1);
            //picking symbol
            psymbol = (prompt("Pick your symbol Player One(letter): ")).toUpperCase();
            while ((psymbol).isdigit() || psymbol.length != 1){
                message.channel.send("Please select a letter.")
                psymbol = (prompt("Pick your symbol Player One(letter): ")).toUpperCase();
            }
            p2symbol = (prompt("Pick your symbol Player Two(letter): ")).toUpperCase();
            while ((p2symbol).isdigit() || p2symbol == psymbol || p2symbol.length != 1){
                message.channel.send("Please select a letter.")
                p2symbol = (prompt("Pick your symbol Player Two(letter): ")).toUpperCase();
            into_rounds = true
            }
            while (into_rounds){
                board()
                move_check()
                who_turn()
                message.channel.send()
                win_check()
            }
        }
    }
    /*let embed = new Discord.RichEmbed()
        .setTitle()
        .setImage()
        .setColor("#633092")
    message.channel.send({embed: embed});*/
}

module.exports.help = {
    name: "ttt"
}