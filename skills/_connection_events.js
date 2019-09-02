/* This module kicks in if no Botkit Studio token has been provided */

module.exports = function(controller) {

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', conductOnboarding);

    function conductOnboarding(bot, message) {

      bot.startConversation(message, function(err, convo) {

        convo.say({
          text: 'Olá humano! Meu nome é Lia, me mande um oi!!',
          quick_replies: [
            {
              title: 'Oi',
              payload: 'Oi',
            },
          ]
        });


      });

    }


}
