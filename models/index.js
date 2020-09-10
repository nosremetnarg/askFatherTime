const User = require('./User');
const Question = require('./Question');
const Vote = require('./Vote');
const Answer = require('./Answer');

// create associations associates user with posts

User.hasMany(Question, {
    foreignKey: 'user_id'
});
// associates posts with user
// constraint is that a post can belong to one user, not many
// this is a common relationship for backend dev folks
/*
Creating associations in sequelize is done by calling one of the belongsTo / hasOne / hasMany / belongsToMany 
functions on a model (the source), and providing another model as the first argument to the function (the target).
*/
Question.belongsTo(User, {
    foreignKey: 'user_id',
});



Answer.belongsTo(User, {  // answer relationships
    foreignKey: 'user_id'
  });
  
  Answer.belongsTo(Question, {
    foreignKey: 'question_id'
  });
  
  User.hasMany(Answer, {
    foreignKey: 'user_id'
  });
  
  Question.hasMany(Answer, {
    foreignKey: 'question_id'
  });

module.exports = { User, Question, Vote, Answer };

