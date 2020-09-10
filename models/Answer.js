const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Answer extends Model { }

Answer.init(
    {
        // columns will go here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        answer_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { // validates that a answer is at least 1 character long
                len: [1]
            }
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        question_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'question',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'answer'
    }
);

module.exports = Answer;