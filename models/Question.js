const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Question model
class Question extends Model {
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            question_id: body.question_id
        }).then(() => {
            return question.findOne({
                where: {
                    id: body.question_id
                },
                attributes: [
                    'id',
                    'question_url',
                    // 'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}
// create fields/columns for Question model
// Internally, sequelize.define calls Model.init, so both approaches are essentially equivalent.
// takes in attributes (columns) then options freezetableNames etc..

Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // title: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        question_url: {
            type: DataTypes.STRING,
            allowNull: false
            
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'question'
    }
);

module.exports = Question;

