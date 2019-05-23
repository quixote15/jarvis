module.exports = (controller) =>{

     /**
     * Start the bots brains in motion!!
     */
    controller.startTicking();
    
    // Set up an Express-powered webserver to expose oauth and webhook endpoints
    var webserver = require(__dirname + '/components/express_webserver.js')(controller);

    // Load in some helpers that make running Botkit on Glitch.com better
    require(__dirname + '/components/plugin_glitch.js')(controller);

    // Load in a plugin that defines the bot's identity
    require(__dirname + '/components/plugin_identity.js')(controller);

    // Open the web socket server
    controller.openSocketServer(controller.httpserver);


    /**
     * Web bot skills configuration
     */
    var normalizedPath = require("path").join(__dirname, "skills");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./skills/" + file)(controller);
    });
}