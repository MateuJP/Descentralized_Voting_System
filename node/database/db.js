import { Sequelize } from "sequelize";
import { configDB } from '../config/index.js';

const db = new Sequelize(configDB.database, configDB.user, configDB.password, {
  host: configDB.host,
  dialect: configDB.dialect,
  dialectOptions: {
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  }
})
export default db;