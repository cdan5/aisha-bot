var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

//Raid object
var party = null;

var wantedItems = [];



// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // It will listen for messages that will start with `$`
	
	var commands = ['ping', 'makeraid', 'createitem', 'deleteitem', 'drop', 'clear', 'raidinfo', 'help'];
	
    if (message.substring(0, 1) == '$') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
				break;
			case 'makeraid':
				if (!party){
					if (args > 4 || args == 0){
						bot.sendMessage({
							to: channelID,
							message: 'There are too many people or no one in the raid. Please input 1-4 names for the raid.'
						})
					}else{
						party = [];
						for (c = 0; c < args.length; c++){
							party.push(args[c]);
						}
					
						bot.sendMessage({
							to: channelID,
							message: 'Raid made!'
						})
					}
				}else{
					bot.sendMessage({
						to: channelID,
						message: 'There is an existing raid party at the moment'
					})
				}
				break;
			case 'createitem':
				if (party){
					if (args == 0){
						bot.sendMessage({
							to: channelID,
							message: 'Please input a raid item people want'
						})						
					}else{
						itemsMade = '';
						for (c = 0; c < args.length; c++){
							var item = {
								name: String,
								party: [String],
								turn: Number
							}
							item.name = args[c];
							item.party = party;
							item.turn = 0;
							wantedItems.push(item);
							if (c == args.length - 1){
								itemsMade += item.name;
							}else{
								itemsMade += item.name + ', ';
							}
						}
						
						bot.sendMessage({
							to: channelID,
							message: 'Item(s) ' + itemsMade + ' made.'
						})
					}
				}else{
					bot.sendMessage({
						to: channelID,
						message: 'Raid party does not exist'
					})
				}
				break;
			case 'deleteitem':
				bot.sendMessage({
					to: channelID,
					message: 'Not implemented yet'
				})
				break;
			case 'drop':
				if (party){
					if (args == 0){
						bot.sendMessage({
							to: channelID,
							message: 'Please input the dropped raid item.'
						})					
					}else{
						var found = -1;
						for (c = 0; c < wantedItems.length; c++){
							console.log("test");
							if (wantedItems[c].name === args[0]){
								found = c;
								break;
							}
						}
						
						if (found != -1){
							var foundItem = wantedItems[found];
							
							bot.sendMessage({
								to: channelID,
								message: foundItem.party[foundItem.turn] + ' ' + foundItem.name
							})
							
							foundItem.turn += 1;
							if (foundItem.turn >= foundItem.party.length){
								foundItem.turn = 0;
							}
						}else{
							bot.sendMessage({
								to: channelID,
								message: 'Item not found.'
							})
						}
					}
				}else{
					bot.sendMessage({
						to: channelID,
						message: 'Raid party does not exist'
					})
				}
				break;
			case 'clear':
				if (party){
					party = null;
					wantedItems = [];
					bot.sendMessage({
						to: channelID,
						message: 'Raid party is cleared'
					})
				}else{
					bot.sendMessage({
						to: channelID,
						message: 'Raid party does not exist'
					})
				}
				break;
			case 'raidinfo':
				if (party){
					bot.sendMessage({
						to: channelID,
						message: 'Raid party: ' + party 
					})
				}else{
					bot.sendMessage({
						to: channelID,
						message: 'Raid party does not exist'
					})
				}
				break;
			case 'help':
				bot.sendMessage({
					to: channelID,
					message: "Here are the list of commands: " + commands
				})
            break;
         }
     }
});