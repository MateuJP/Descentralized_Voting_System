import db from "../database/db.js";
import { DataTypes } from "sequelize";
import OptionModel from "./OptionModel.js";
import VotationModel from "./VotationModel.js";

const IdentificationModel=db.define('IDENTIFICATION',{
    idOption : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        references : {
            model : OptionModel,
            key : 'idOption'
        }
    },
    idVotation : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        references : {
            model : VotationModel,
            key : 'idVotation'
        }

    },
    option_Id : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
}, {
    tableName : 'IDENTIFICATION',
    timestamps : false
});

IdentificationModel.belongsTo(OptionModel,{foreignKey : 'idOption'});
IdentificationModel.belongsTo(VotationModel, {foreignKey : 'idVotation'});
export default IdentificationModel;