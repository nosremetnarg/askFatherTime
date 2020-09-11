const router = require('express').Router();
const { Question, User, Vote, Answer } = require('../../models'); // these create the express endpoints
// we want to pull information from Question as well as User, and Vote
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// get all questionss
router.get('/', (req, res) => {
    console.log('===============');
    Question.findAll({
        attributes: [
            'id',
            'question_url',
            // 'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [ // this makes a JOIN 
            {
                model: Question,
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
        .then(dbQuestionData => res.json(dbQuestionData)) // return the promise
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// get a single question
router.get('/:id', (req, res) => {
   Question.findOne({
        where: {
            id: req.params.id // sets the value of the id with req.params.id
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
        .then(dbQuestionData => { // return the promise
            if (!dbQuestionData) {
                res.status(404).json({ message: 'No question found with this id' }); // 404 is user error
                return;
            }
            res.json(dbQuestionData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create a post route
router.post('/', withAuth, (req, res) => {
    // expects json info back
    Question.create({

        // title: req.body.title,
        question_url: req.body.question_url,
        user_id: req.session.user_id

    })
        .then(dbQuestionData => res.json(dbQuestionData)) // return the promise

        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

// PUT /api/questions/upvote
router.put('/upvote', withAuth,  (req, res) => {
    // make sure the session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        Question.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Answer, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});


//create put route
router.put('/:id', withAuth, (req, res) => {
    // console.log(req.body.title, req.params.id);
    Question.update(
        {
            // title: req.body.title,
            question_url: req.body.question_url // finding the question with req.body.title and replace the title of the question
        },
        {
            where: {
                id: req.params.id // matching the id
            }
        }
    )
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'error message' });
                return;
            }
            res.json(dbUserData);
            // res.redirect('/dashboard');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create delete/destroy route
router.delete('/:id', withAuth, (req, res) => {
    // console.log("delete this question", req.body)
    Question.destroy({
        where: {
            id: req.params.id,
            user_id: req.session.user_id

            
        }
    })
        .then(dbQuestionData => {
            if (!dbQuestionData) {
                res.status(404).json({ message: 'No question with this id' });
                return;
            }
            res.json(dbQuestionData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

module.exports = router; // this exposes the changes/code to the express server. Keep this at the bottom of the file