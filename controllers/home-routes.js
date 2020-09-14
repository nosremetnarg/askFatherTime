const router = require('express').Router();
const sequelize = require('../config/connection');
const { Question, User, Answer } = require('../models'); // importing modules and models
// const withAuth = require('../utils/auth');

//sign-up route
router.get('/sign-up', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('sign-up');
});


//chatroom route
router.get('/chat', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
    }
    // res.sendFile(__dirname + "/../public/chatroom.html");
    res.sendFile(public_folder+'/chatroom.html');
    console.log(process.cwd());
    
});

// login route
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// <<<<<<< HEAD
// <<<<<<< HEAD
// signup route
router.get('/sign-up', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('sign-up');
});
// =======
// C:\Users\melan\OneDrive\Desktop\askFatherTime\public\chatroom.html


// >>>>>>> e2467f8fb65752350624e80a2bd1a9d0bf7a970f
// =======
// >>>>>>> 5d3ff244f2d450838d476f2659b57382fc9d3f2c

// get all questions
router.get('/', (req, res) => {
    // console.log(req.session);
    Question.findAll({
        attributes: [
            'id',
            'question_url',
            // 'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'), 'vote_count']
        ],
        include: [
            // {
            //     model: Question,
            //     attributes: ['id', 'answer_text', 'question_id', 'user_id', 'created_at'],
            //     include: {
            //         model: User,
            //         attributes: ['username']
            //     }
            // },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbQuestionData => {
            // pass a single question object into the homepage template
            // console.log(dbQuestionData[0]);
            const questions = dbQuestionData.map(question => question.get({ plain: true })); // loops over and maps each sequelize object into a serialized version of itself

            res.render('homepage', {
                questions,
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

// get single question
router.get('/question/:id', (req, res) => {
    Question.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'question_url',
            // 'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'), 'vote_count']
        ],
        include: [
            {
                model: Answer,
                attributes: ['id', 'answer_text', 'question_id', 'user_id', 'created_at'],
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
        .then(dbQuestionData => {
            if (!dbQuestionData) {
                res.status(404).json({ message: 'No question found with this id' });
                return;
            }

            // serialize the data. make it more simple to read
            const question = dbQuestionData.get({ plain: true });

            // pass data to template and create page and checks if user is logged in
            res.render('single-question', {
                question,
                loggedIn: req.session.loggedIn
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;

