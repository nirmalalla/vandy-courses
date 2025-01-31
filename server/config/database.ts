const { Sequelize } = require("sequelize");
import * as dotenv from "dotenv";
import { authPlugins } from "mysql2";
import * as path from "path"

dotenv.config({path: path.resolve(process.cwd(), ".env")});


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: console.log,
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    }
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