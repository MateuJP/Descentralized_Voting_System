import db from "../database/db.js";
import { DataTypes } from "sequelize";
import VotationModel from './VotationModel.js'
import OptionModel from "./OptionModel.js";

const VoteModel = db.define('VOTE',{
    idVote : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    wallet : {
        type : DataTypes.STRING,
        allowNull : false
    },
    idVotation : {
        type : DataTypes.INTEGER,
        references : {
            model : VotationModel,
            key : 'idVotation'
        }
    },
    idOption : {
        type : DataTypes.INTEGER,
        references : {
            model : OptionModel,
            key : 'idOption'
        }
    }
    
    
}, {
    tableName : 'VOTE',
    timestamps : false
})
VoteModel.belongsTo(VotationModel,{foreignKey : 'idVotation'});
VoteModel.belongsTo(OptionModel,{foreignKey : 'idOption'});
export default VoteModel;