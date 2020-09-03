const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// create associations associates user with posts

User.hasMany(Post, {
    foreignKey: 'user_id'
});
// associates posts with user
// constraint is that a post can belong to one user, not many
// this is a common relationship for backend dev folks
/*
Creating associations in sequelize is done by calling one of the belongsTo / hasOne / hasMany / belongsToMany 
functions on a model (the source), and providing another model as the first argument to the function (the target).
*/
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

Comment.belongsTo(User, {  // comment relationships
    foreignKey: 'user_id'
  });
  
  Comment.belongsTo(Post, {
    foreignKey: 'post_id'
  });
  
  User.hasMany(Comment, {
    foreignKey: 'user_id'
  });
  
  Post.hasMany(Comment, {
    foreignKey: 'post_id'
  });

module.exports = { User, Post, Vote, Comment };

