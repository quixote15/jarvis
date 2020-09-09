var env = require("node-env-file");
env(__dirname + "/.env");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const axios = require("axios");

module.exports = controller => {
  let bot = controller.spawn({}); //create a bot instance

  var rasa = require("./skills/midleware-rasa")({
    rasa_uri: "https://fe.fecho.app",
    rasa_project: "jarvis"
  });

  controller.middleware.receive.use(rasa.receive);

  controller.on("message_received", function(bot, message) {
    console.log("mensagem saas:", message);
    const { replies, from, to } = message;
    //console.log(replies)
    replies.forEach(answer => {
      console.log("text:", answer.text || answer.image);
      const { text, image } = answer;
      const reply = {
        text,
        files: [
          {
            url: image,
            image: !!image
          }
        ]
      };

      console.log('numero da fe: ', to);

      client.messages
        .create({
          body: text,
          from: to,
          to: from
        })
      .then(result => {
        console.log('ENVIOU MENSAGEM PARA WHATS: ', result);
        console.log('ENVIOU MENSAGEM PARA WHATS: ');
      })
      .catch(error => {
        console.log('ERROR AO ENVIAR');
        console.log('ERROR AO ENVIAR', error);
        console.log('ERROR AO ENVIAR');
      });


    });
    
  });

  require('./skills/nlu_processing')(controller);

  controller.setupWebserver(process.env.TWILIO_PORT, function(err, webserver) {
    controller.createWebhookEndpoints(controller.webserver, bot, function() {
      console.log(
        "TwilioSMSBot is online on port : " + process.env.TWILIO_PORT
      );
    });
  });
  /*
  controller.hears(["hi", "hello"], "message_received", (bot, message) => {
    const {from, to} = message;
    client.messages.create({
      body: 'fala seu arrombado!! Aqui é TCC de chatbots!',
      from: to,
      to: from
    }).then(message => console.log(`enviou a mensagem ` + message.sid))
    .done()
    console.log(`recebeu hi,hello`, message);
  });

  controller.hears(".*", "message_received", (bot, message) => {
    const {from, to} = message;
    client.messages.create({
      body: 'fala seu arrombado!! Aqui é TCC de chatbots!',
      from: to,
      to: from
    }).then(message => console.log(`enviou a mensagem ` + message.sid))
    .done()
    console.log(`recebeu hi,hello`, message);
  });*/
};
