module.exports = (controller)=>{


    /**
     * Start the bots brains in motion!!
     */
    controller.startTicking();
        
    /**
     * Set up a webhook in express to expose oauth and webhook endpoints
     * When the user wants to use the bot he needs to authorize and authenticate
     * Also the webhook endpoints must be active to receive slack incoming messages and events.
     */
    var webserver = require(`${__dirname}/slack_components/express_webserver`)(controller);

  
    /**
     * Set up a storage backend for keeping user records
     * whoever signup for the app via oauth
     * TODO: Also sendo to the Rasa or NLU server
     */
    require(`${__dirname}/slack_components/user_registration.js`)(controller);
    
    /**
     * Send an onboarding message when a new team joins
     * Or adds the bot to the slack team
     */
    require(`${__dirname}/slack_components/onboarding.js`)(controller);


    /**
     * Set up all the bot skills for slack
     * Skills may include events, middlewares and notifications.
     */
    var normalizePath = require('path').join(`${__dirname}/slack_skills`);
    require('fs').readdirSync(normalizePath).forEach((file)=>{
        require(`/slack_skills/${file}`)(controller);
    });



}