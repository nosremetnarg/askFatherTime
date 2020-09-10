const router = require('express').Router();

const userRoutes = require('./user-routes'); // pulls in user
router.use('/users', userRoutes);

const questionRoutes = require('./question-routes'); // pulls in question
router.use('/questions', questionRoutes)

const answerRoutes = require('./answer-routes'); // pulls in answers
router.use('/answers', answerRoutes);

module.exports = router;

// this files acts a hub, gathering all the routes in one location