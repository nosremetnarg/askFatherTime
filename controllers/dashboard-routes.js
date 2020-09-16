const router = require('express').Router();
const sequelize = require('../config/connection');
const { Question, User, Answer } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, (req, res) => {
    Question.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'question_url',
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
                attributes: ['username',]
            }
        ]
    })
        .then(dbQuestionData => {
            // serialize data before passing to template
            const questions = dbQuestionData.map(question => question.get({ plain: true }));
            res.render('dashboard', { questions, loggedIn: true});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// this renders the handlebars file
// loggedIn set to true....only users that are logged in can get to this route

router.get('/edit/:id', withAuth, (req, res) => {
    Question.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'question_url',
            // 'title',
            'created_at'
            // [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'), 'vote_count']
        ],
        include: [
            {
                model: Answer,
                attributes: ['id', 'answer_text', 'question_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username',]
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbQuestionData => {
            // serialize data before passing to template
            const question = dbQuestionData.get({ plain: true });
            // console.log("title", post.title);
            // console.log("post_url", post.post_url);
            res.render('edit-question', { question, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

module.exports = router;