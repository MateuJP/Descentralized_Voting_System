import db from "../database/db.js";
import { DataTypes } from "sequelize";

const VotationModel = db.define('VOTATION', {
    idVotation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_votation: {
        type: DataTypes.STRING

    },
    date_creation: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_active: {
        type: DataTypes.TINYINT
    },
    is_closed: {
        type: DataTypes.TINYINT
    }
}, {
    tableName: 'VOTATION',
    timestamps: false
});
export default VotationModel;