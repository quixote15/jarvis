
module.exports = function(controller) {

    var rasa = require('./midleware-rasa')({rasa_uri: 'http://localhost:5005',rasa_project: 'jarvis'});
    controller.middleware.receive.use(rasa.receive);
  
    controller.on('message_received', function(bot, message) {
    
        console.log('mensagem saas:', message);
        const { replies } = message;
        //console.log(replies)
        replies.forEach(answer => {
            console.log('text:', answer.text || answer.image)
            bot.reply(message,answer.text || answer.image)

        })
        //bot.startConversation()

    });
}
