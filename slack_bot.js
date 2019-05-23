module.exports = (controller)=>{


    /**
     * Start the bots brains in motion!!
     */
    controller.startTicking();
        
    /**
     * Set up a webhook in express to expose oauth and webhook endpoints
     * When the user wants to use the bot he needs to authorize and authenticate
     * Also the webhook endpoints must be active to receive slack incoming messages and events.
     */
    var webserver = require(`${__dirname}/slack_components/express_webserver`)(controller);

  
    /**
     * Set up a storage backend for keeping user records
     * whoever signup for the app via oauth
     * TODO: Also sendo to the Rasa or NLU server
     */
    require(`${__dirname}/slack_components/user_registration.js`)(controller);
    
    /**
     * Send an onboarding message when a new team joins
     * Or adds the bot to the slack team
     */
    require(`${__dirname}/slack_components/onboarding.js`)(controller);


    /**
     * Set up all the bot skills for slack
     * Skills may include events, middlewares and notifications.
     */
    var normalizePath = require('path').join(`${__dirname}/slack_skills`);
    require('fs').readdirSync(normalizePath).forEach((file)=>{
      ///  require(`/slack_skills/${file}`)(controller);
    });



    

    controller.hears('hear_message', 'direct_message,direct_mention,mention', function(bot, message) {
        console.log('ouviu')
        controller.storage.teams.save({id: message.team, foo:'bar'}, function(err) { console.log(err) });
    });

/**
 * 
     controller.hears(
         ['hello', 'hi', 'greetings'],
         ['direct_mention', 'mention', 'direct_message'],
         function(bot,message) {
             bot.reply(message,'Hello!');
         }
     );
 */

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Hello ' + user.name + '!!');
            } else {
                bot.reply(message, 'Hello.');
            }
        });
    });

}