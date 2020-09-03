const router = require('express').Router();

const userRoutes = require('./user-routes'); // pulls in user
router.use('/users', userRoutes);

const postRoutes = require('./post-routes'); // pulls in post
router.use('/posts', postRoutes)

const commentRoutes = require('./comment-routes'); // pulls in comments
router.use('/comments', commentRoutes);

module.exports = router;

// this files acts a hub, gathering all the routes in one location