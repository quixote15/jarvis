const request = require('request-promise')
const debug = require('debug')('botkit:rasa')

module.exports = config => {
  if (!config) {
    config = {}
  }

  if (!config.rasa_uri) {
    config.rasa_uri = 'http://localhost:5000'
  }

  var middleware = {
    receive: (bot, message, next) => {
      // is_echo: can be true for facebook bots when the echo webhook is subscribed
      // bot_id: keep an eye https://github.com/howdyai/botkit/pull/694
      // if bot_id is present, the message comes from another bot
     // console.log('Resposta rasa', message);
      if (!message.text || message.is_echo || message.bot_id) {
        next()
        return
      }
      console.log('mensgaem', message.user)
     // console.log('bot', bot)
      debug('Sending message to Rasa', message.text)
      const options = {
        method: 'POST',
        uri: `${config.rasa_uri}/webhooks/rest/webhook`,
        body: {
          message: message.text,
          sender: message.user,
          project: `${config.rasa_project}`
        },
        json: true
      }

      request(options)
        .then(response => {
          console.log('Rasa response', response)
          message.replies = response;
       //   message.entities = response.entities
          
          next()
        })
    },

    hears: (patterns, message) => {
      return patterns.some(pattern => {
        if (message.intent.name === pattern) {
          debug('Rasa intent matched hear pattern', message.intent, pattern)
          return true
        }
      })
    },

    answer: (patterns,message) =>{
        console.log(message)
        return message;
    }

  }
  return middleware
}