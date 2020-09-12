const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../models'); // these create the express endpoints
// we want to pull information from Post as well as User, and Vote
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

// chat route
router.get('/chatroom', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/chatroom');
        return;
    }

    res.render('chatroom');
});