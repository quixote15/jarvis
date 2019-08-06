var env = require("node-env-file");
env(__dirname + "/.env");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const axios = require("axios");

module.exports = controller => {
  let bot = controller.spawn({}); //create a bot instance

  controller.setupWebserver(process.env.TWILIO_PORT, function(err, webserver) {
    controller.createWebhookEndpoints(controller.webserver, bot, function() {
      console.log(
        "TwilioSMSBot is online on port : " + process.env.TWILIO_PORT
      );
    });
  });

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
  });
};
