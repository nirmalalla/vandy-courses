const { Sequelize } = require("sequelize");
import * as dotenv from "dotenv";
import { authPlugins } from "mysql2";
import * as path from "path"

dotenv.config({path: path.resolve(process.cwd(), ".env")});


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: "localhost",
    logging: console.log,
    dialect: "mysql",
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connection established");
    } catch (error) {
        console.error("unable to connect", error);
    }
}

testConnection();

export default sequelize;