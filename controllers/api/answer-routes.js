const router = require('express').Router();
const { Answer } = require('../../models'); //destructored Answer Object
const withAuth = require('../../utils/auth');

// get route to find all answers
router.get('/', (req, res) => {
    Answer.findAll({

    })
        .then(dbAnswerData => res.json(dbAnswerData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// create answer post route
router.post('/', withAuth, (req, res) => {
    // check the session
    if (req.session) {
        Answer.create({
            answer_text: req.body.answer_text,
            question_id: req.body.question_id,
            // use the id from the session
            user_id: req.session.user_id
        })
            .then(dbAnswerData => res.json(dbAnswerData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

// delete route to destroy the information
router.delete('/:id', (req, res) => {
    Answer.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => { // returns promise
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
