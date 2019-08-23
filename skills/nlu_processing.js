module.exports = function(controller) {
  var rasa = require("./midleware-rasa")({
    rasa_uri: "http://165.22.220.204:5005",
    rasa_project: "jarvis"
  });
  controller.middleware.receive.use(rasa.receive);

  controller.on("message_received", async function(bot, message) {
    console.log("mensagem saas:", message);

    const { replies } = message;
    //console.log(replies)
 
    for (var i = 0; i < replies.length; i++) {
      const answer = replies[i];
      console.log("text:", answer.text || answer.image);

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
      /* bot.reply(message, reply, function() {
        console.log("done ", index);
      });*/
      await sendMessage(bot, message, reply);
    }

    /*replies.forEach(async (answer, index) => {
      
    });*/
    //bot.startConversation()
  });

  const sendMessage = async (bot, message, reply) => {
    return new Promise(resolve =>
      setTimeout(() => resolve(bot.reply(message, reply)), 1000)
    );
  };
};
