const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001; // makes app compatible with Heroku. Runs and env port live and 3001 locally

// This sets up HANDLEBARS.js HTML template engine
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: process.env.Secret,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));
// add in css stylesheet
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => { // sequelize taking the models and connecting them to associated database tables
    app.listen(PORT, () => console.log('Now listening'));
});
// if force was set to true it would drop and re-create all the database tables on startup
// force true will make tables re-create in there are any association changes