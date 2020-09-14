const express = require('express');
const routes = require('./controllers/');
const path = require('path');
const http = require('http');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const botName = "Father Time";
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var publicFolder = __dirname + '/public/';
public_folder = publicFolder;




// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcomes current user
        socket.emit('message', formatMessage(botName, 'Welcome to Ask Father Time'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message',
                formatMessage(botName, `${user.username} has left the chat`));

            // send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

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