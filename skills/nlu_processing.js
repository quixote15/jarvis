module.exports = function(controller) {
  var rasa = require("./midleware-rasa")({
    rasa_uri: "http://localhost:5005",
    rasa_project: "jarvis"
  });
  //controller.middleware.receive.use(rasa.receive);

  /*controller.on("message_received", async function(bot, message) {
    console.log("mensagem saas:", message);
    const { replies } = message;
    //console.log(replies)
    replies.forEach(answer => {
      console.log("text:", answer.text || answer.image);
      let {text, image} = answer;
      message.image = "answer.image";
      var reply = {
        text: 'Look, an image!',
        files: [
            {
              url: 'http://tableflipper.com/IRX2.gif',
              image: true
            }
        ]
      }
       bot.reply(message, reply);
    });
    //bot.startConversation()
  });*/
  controller.on("message_received", async function(bot, message) {
    var reply = {
      
      files: [
        {
          url:
            "https://3dwarehouse.sketchup.com/warehouse/v1.0/publiccontent/c01763b1-77ee-4b29-bbec-4c14f62b127a",
          image: true
        }
      ]
    };
    bot.reply(message, reply);

    //bot.startConversation()
  });
};
