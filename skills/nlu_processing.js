module.exports = function(controller) {
  var rasa = require("./midleware-rasa")({
    rasa_uri: "http://159.65.239.177:5005",
    rasa_project: "jarvis"
  });
  controller.middleware.receive.use(rasa.receive);

  controller.on('receive_error', function(err, bot, message) {
    bot.reply(message, `There was an error processing your request. Please try again later. Error: ${err.toString()}`);
    });

  controller.on("message_received", async function(bot, message) {
   console.log("RASA RESPONDEU:", message.replies);

    const { replies } = message;

    bot.startConversation(message, function(err, convo) {

      console.log('ENTROU startConversation', message);
      console.log('ENTROU startConversation error', err);

      if(err) {
        return convo.say(reply);
      }

      for (var i = 0; i < replies.length; i++) {
        const answer = replies[i];
      //  console.log("text:", answer.text || answer.image);
      //  console.log("message:", message);

        let { text = '', image } = answer;
        text = !!image ? 'Imóvel' : text;
        const reply = {
          text,
          replyWithTyping: true,
          files: [
            {
              url: image,
              image: !!image
            }
          ]
        };

        console.log('Botkit Reply: ', reply)

        convo.say(reply);

      }
    });
    
  });

};
