const express = require('express');
const routes = require('./controllers/');
const path = require('path');
const http = require('http');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketio(server);
// Run when client connects
io.on('connection', socket => {

    // Welcomes current user
    socket.emit('message', 'Welcome to Ask Father Time');

    //Broadcast when a user connects
    socket.broadcast.emit('message', 'a user has joined the chat');

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });
   
})

// This sets up HANDLEBARS.js HTML template engine
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

require('dotenv').config();


const sess = {
    secret: 'superSecret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const PORT = process.env.PORT || 3001; // makes app compatible with Heroku. Runs and env port live and 3001 locally

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session(sess));



// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => { 
    server.listen(PORT, () => console.log('Now listening'));
});
// if force was set to true it would drop and re-create all the database tables on startup
// force true will make tables re-create in there are any association changes