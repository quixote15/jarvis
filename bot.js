/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
 * Configuração das variáveis de ambiente
 * Mongo, API_KEY, Token, etc.
 */
var env = require("node-env-file");
env(__dirname + "/.env");

/**
 * Verificar se as chaves do webhook do Slack foram declaradas ou carregadas.
 */
if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  usage_tip();
}

/**
 * Importa a instancia do  Botkit
 */
var Botkit = require("botkit");
var debug = require("debug")("botkit:main");

/**
 * Objeto de configuração do controller botkit
 */
var bot_options = {
  replyWithTyping: true,
  typingDelay: 1500
};

var slack_options = {
  clientId: process.env.clientId || null,
  clientSecret: process.env.clientSecret || null,
  clientSigningSecret: process.env.clientSigningSecret || null,
  scopes: ["bot"],
  studio_token: process.env.studio_token || null,
  studio_command_uri: process.env.studio_command_uri || null,
  replyWithTyping: true
};

var twilioOptions = {
  account_sid: process.env.TWILIO_ACCOUNT_SID,
  auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_number: process.env.TWILIO_NUMBER
};

/*
 Use a mongo database if specified, otherwise store in a JSON file local to the app.
 Mongo is automatically configured when deploying to Heroku
 */
if (process.env.MONGO_URI) {
  // create a custom db access method
  var mongostorage = require("botkit-storage-mongo")({
    mongoUri: process.env.MONGO_URI
  });
  bot_options.storage = mongostorage;
  slack_options.storage = mongostorage;
} else {
  bot_options.json_file_store = __dirname + "/.data/db/"; // store user data in a simple JSON format
  slack_options.json_file_store = __dirname + "/.data/db/"; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.socketbot(bot_options);
var slack_controller = Botkit.slackbot(slack_options);
var twilioController = Botkit.twiliosmsbot(twilioOptions);

require("./web_bot.js")(controller);
//require("./slack_bot.js")(slack_controller);
require("./twilio.js")(twilioController);

console.log(
  "I AM ONLINE! COME TALK TO ME: http://localhost:" + (process.env.PORT || 1080)
);

function usage_tip() {
  console.log("~~~~~~~~~~");
  console.log("Botkit Starter Kit");
  console.log("For Web: Execute your bot application like this:");
  console.log("PORT=" + process.env.PORT + " node bot.js");
  console.log("~~~~~~~~~~");

  console.log("~~~~~~~~~~");
  console.log("Botkit Starter Kit");
  console.log("For Slackbot: Execute your bot application like this:");
  console.log(
    "clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 node bot.js"
  );
  console.log("Get Slack app credentials here: https://api.slack.com/apps");
  console.log("PORT=" + process.env.SLACK_PORT + " node bot.js");
  console.log("~~~~~~~~~~");
}
