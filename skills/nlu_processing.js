module.exports = function(controller) {
  var rasa = require("./midleware-rasa")({
    rasa_uri: "http://165.22.220.204:5005",
    rasa_project: "jarvis"
  });
  controller.middleware.receive.use(rasa.receive);

  controller.on("message_received", async function(bot, message) {
    //console.log("mensagem saas:", message);

    const { replies } = message;

    bot.startConversation(message, function(err, convo) {
      for (var i = 0; i < replies.length; i++) {
        const answer = replies[i];
      //  console.log("text:", answer.text || answer.image);
      //  console.log("message:", message);

        const { text, image } = answer;
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

        convo.say(reply);

      }
    });
    
  });

};
