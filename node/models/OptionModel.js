import db from "../database/db.js";
import { DataTypes } from "sequelize";

const OptionModel= db.define('OPTIONS', {
    idOption : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    title : {
        type : DataTypes.STRING,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false
    }
}, {
    tableName : 'OPTIONS',
    timestamps : false
})

export default OptionModel;