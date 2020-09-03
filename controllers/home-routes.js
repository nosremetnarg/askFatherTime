const router = require('express').Router();

const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models'); // importing modules and models
const withAuth = require('../utils/auth');


// login route
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// get all posts
router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // pass a single post object into the homepage template
            console.log(dbPostData[0]);
            const posts = dbPostData.map(post => post.get({ plain: true })); // loops over and maps each sequelize object into a serialized version of itself

            res.render('homepage', {
                posts,
                loggedIn: req.session.loggedIn
            });
            // .handlebars extension is implied
            // get returns simple information
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }); // using render instead of send or sendfile
});

// get single post
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data. make it more simple to read
            const post = dbPostData.get({ plain: true });

            // pass data to template and create page and checks if user is logged in
            res.render('single-post', {
                post,
                loggedIn: req.session.loggedIn
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;

