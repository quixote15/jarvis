var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require('http');
var hbs = require('express-hbs');

/**
 * Creates a express server to listen to slack requests
 * Defines routes and server listening port and middlewares
 * Then, Injects the express server into the passed controller for later use.
 */
module.exports = (controller)=>{
    // Creates an express instance
    var webserver = express();

    /**
     * Set up all express middlewares that will be used on every request
     */
    webserver.use(function(req,res,next){
        req.rawBody = '';
        req.on('data',function(chunk){
            req.rawBody += chunk;
        });

        next();
    });
    webserver.use(cookieParser());
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({extended: true}));

    /**
     * Set up static server resouces andpoint
     */
    webserver.engine('hbs', hbs.express4({partialsDir: `${__dirname}/../views/partials`}));
    webserver.set('views',  `${__dirname}/../views/` );

    webserver.use(express.static('public'));


    /**
     * Creates a http server instance and makes the server to listen to the defined port
     */
    var server = http.createServer(webserver);

    server.listen(process.env.PORT || 8765, null, function(){
        console.log('Webhook Slack está escutando em  http://localhost:' + process.env.SLACK_PORT || 3000);

    });
    

    /**
     * Imports all the server routes that will be used
     */
    var normalizePath = require('path').join(__dirname, 'routes');
    require('fs').readdirSync(normalizePath).forEach(file =>{
        require(`./routes/${file}`)(webserver,controller);
    });

    /**
     * Injects the wevserver into the botkit controller
     */
    controller.webserver = webserver;
    controller.httpServer = server;

    return webserver;
}