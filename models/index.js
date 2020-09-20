const User = require('./User');
const Question = require('./Question');
const Vote = require('./Vote');
const Answer = require('./Answer');

// create associations associates user with posts

User.hasMany(Question, {
    foreignKey: 'user_id'
});

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

