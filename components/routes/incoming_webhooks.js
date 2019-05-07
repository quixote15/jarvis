var debug = require('debug')('botkit:incoming_webhooks');

module.exports = function(webserver, controller) {

    debug('Configured /botkit/receive url');
  
    webserver.post('/botkit/receive/868160088:AAHgAhD47y2VhgwmWP5kzdkypG1hNcSBoQc', function(req, res) {

        console.log('chamou', req.params);
        // respond to Slack that the webhook has been received.
        res.status(200);


        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res);

    });

}
