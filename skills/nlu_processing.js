
module.exports = function(controller) {

    var rasa = require('botkit-rasa')({rasa_uri: 'http://localhost:5000',rasa_project: 'jarvis'});
    controller.middleware.receive.use(rasa.receive);
  
    controller.hears(['order_product'],'message_received', rasa.hears, function(bot, message) {
    
        console.log('Intent:', message.intent);
        console.log('Entities:', message.entities);    
        console.log('message:', message);    
    
    });
}
